import { ClerkProvider } from "@clerk/clerk-react";
import ReactDOM from "react-dom/client";
import WebcamApp from "./WebcamApp";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Configure VITE_CLERK_PUBLISHABLE_KEY in the .env file to start the app!");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <WebcamApp />
  </ClerkProvider>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
