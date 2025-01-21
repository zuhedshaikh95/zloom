import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const closeApp = () => window.ipcRenderer.send("close-app");

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
});

export const getMediaSources = async () => {
  const displays = await window.ipcRenderer.invoke("get-sources");
  const enumratedDevices = await window.navigator.mediaDevices.enumerateDevices();

  const audioInputs = enumratedDevices.filter((device) => device.kind === "audioinput");

  console.log("getting sources");

  return { displays, audioInputs };
};
