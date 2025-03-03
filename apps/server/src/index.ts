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

const sleep = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
};

// TODO: fix transcription
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY!,
    secretAccessKey: process.env.BUCKET_SECRET_KEY!,
  },
  region: process.env.BUCKET_REGION,
});

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: process.env.ELECTRON_HOST,
    methods: ["GET", "POST"],
  })
);

// routes
app.get("/", (request, response) => {
  response.json({ message: "Hello, topper!" });
});

const server = http.createServer(app);

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
      type: "video/webm;codecs=vp9",
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

    await sleep(100);

    fs.readFile(`uploads/${data.fileName}`, async (error, file) => {
      if (error) {
        console.warn(error.message);
        return;
      }

      console.log({ file, byteLength: file.byteLength, length: file.length });

      if (!file.length) {
        fs.unlink(`uploads/${data.fileName}`, (error) => {
          if (error) {
            console.error(`🔴 fs.unlink Error: ${error.message}`);
            return;
          }

          console.log(`🔴 ${data.fileName} failed to read file, upload aborted!`);
        });
        return;
      }

      try {
        const { data: processing } = await axios.post<RouteReponseT<any>>(
          `${process.env.NEXT_API_HOST}/recording/${data.userId}/processing`,
          { fileName: data.fileName }
        );

        if (!processing.success) {
          console.error(`🔴 /api/recording/processing Error: ${processing.data.message}`);
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

          const { data: completed } = await axios.post<RouteReponseT<any>>(
            `${process.env.NEXT_API_HOST}/recording/${data.userId}/completed`,
            {
              fileName: data.fileName,
            }
          );

          if (!completed.success) {
            console.error(`🔴 /api/recording/completed Error: ${completed.message}`);
            return;
          }

          fs.unlink(`uploads/${data.fileName}`, (error) => {
            if (error) {
              console.error(`🔴 fs.unlink Error: ${error.message}`);
              return;
            }

            console.log(`🟢 ${data.fileName} deleted successfully`);
          });
        }
      } catch (error: any) {
        console.error("Process Video Error:", error.message);
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
