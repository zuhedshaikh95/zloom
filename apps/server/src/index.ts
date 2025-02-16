import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";
import { Readable } from "stream";
import { RouteReponseT } from "./types";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import OpenAI from "openai";

dotenv.config();

const PORT = 8080;
const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.ELECTRON_HOST,
    methods: ["GET", "POST"],
  })
);

const server = http.createServer(app);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY!,
    secretAccessKey: process.env.BUCKET_SECRET_KEY!,
  },
  region: process.env.BUCKET_REGION,
});

const io = new Server(server, {
  cors: {
    origin: process.env.ELECTRON_HOST,
    methods: ["GET", "POST"],
  },
});

let recordedChunks: BlobPart[] = [];

io.on("connection", (socket) => {
  console.log("🟢 Socket is Connected!");

  socket.on("video-chunks", async (data) => {
    console.log("📹 Video Chunk Received!");

    const writeStream = fs.createWriteStream(`uploads/${data.fileName}`);
    recordedChunks.push(data.chunks);

    const videoBlob = new Blob(recordedChunks, {
      type: "video/webm; codecs=vp9",
    });

    const buffer = Buffer.from(await videoBlob.arrayBuffer());

    const readStream = Readable.from(buffer);

    readStream.pipe(writeStream).on("finish", () => {
      console.log("✅ Chunk Saved");
    });
  });

  socket.on("process-video", async (data) => {
    console.log("🔨 Processing video...", data);
    recordedChunks = [];
    fs.readFile(`uploads/${data.fileName}`, async (error, file) => {
      if (error) {
        console.warn(error.message);
        return;
      }

      const processing = await axios.post<RouteReponseT<any>>(
        `${process.env.NEXT_API_HOST}/recording/${data.userId}/processing`
      );

      if (!processing.data.status) {
        console.error(`🔴 /api/recording Error: ${processing.data.message}`);
        return;
      }

      const command = new PutObjectCommand({
        Key: data.fileName,
        Bucket: process.env.BUCKET_NAME,
        ContentType: "video/webm",
        Body: file,
      });

      const fileStatus = await s3.send(command);

      if (fileStatus.$metadata.httpStatusCode === 200) {
        console.log("🟢 Video Uploaded to AWS!");

        if (processing.data.data.plan === "PRO") {
          fs.stat(`uploads/${data.fileName}`, async (error, stat) => {
            if (error) {
              console.error(`fs.stat Error: ${error.message}`);
              return;
            }

            if (stat.size < 25000000) {
              const transcription = await openai.audio.transcriptions.create({
                file: fs.createReadStream(`uploads/${data.fileName}`),
                model: "whisper",
                response_format: "text",
              });

              if (transcription) {
                const completion = await openai.chat.completions.create({
                  model: "gpt-3.5-turbo",
                  response_format: {
                    type: "json_object",
                  },
                  messages: [
                    {
                      role: "system",
                      content: `You are going to generate a title and a nice description using the speech to text transcription provided: ${transcription} and then return it in json format as {"title": <the title you gave>, "summary": <the summary you created>}`,
                    },
                  ],
                });

                const response = await axios.post<RouteReponseT<any>>(
                  `${process.env.NEXT_API_HOST}/recording/${data.userId}/transcribe`,
                  {
                    fileName: data.fileName,
                    content: completion.choices[0].message.content,
                    transcript: transcription,
                  }
                );

                if (!response.data.status) {
                  console.error(`🔴 /api/recording Error: ${processing.data.message}`);
                  return;
                }
              }
            }
          });
        }

        const response = await axios.post<RouteReponseT<any>>(
          `${process.env.NEXT_API_HOST}/recording/${data.userId}/complete`,
          {
            fileName: data.fileName,
          }
        );

        if (!response.data.status) {
          console.error(`🔴 /api/recording Error: ${response.data.message}`);
          return;
        }

        fs.unlink(`uploads/${data.fileName}`, (error) => {
          if (error) {
            console.error(`🔴 fs.unlink Error: ${response.data.message}`);
            return;
          }

          console.log(`🟢 ${data.fileName} deleted successfully`);
        });
      }
    });
  });

  socket.on("disconnect", async () => {
    console.log("🔴 Socket Disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
