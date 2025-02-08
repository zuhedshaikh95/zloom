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

  return { displays, audioInputs };
};

export const hidePluginWindow = (state?: boolean) => {
  window.ipcRenderer.send("hide-plugin", { state });
};

export const videoRecordingTime = (ms: number) => {
  const second = `${Math.floor((ms / 1000) % 60)}`.padStart(2, "0");
  const minute = `${Math.floor((ms / 1000 / 60) % 60)}`.padStart(2, "0");
  const hour = `${Math.floor(ms / 1000 / 60 / 60)}`.padStart(2, "0");

  return { length: `${hour}:${minute}:${second}`, minute };
};
