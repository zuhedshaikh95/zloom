import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import "./App.css";
import { ControlLayout } from "./layouts";
import { AuthButton, Widget } from "@/components/global";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      <Toaster />
      <ControlLayout>
        <AuthButton />
        <Widget />
      </ControlLayout>
    </QueryClientProvider>
  );
}

export default App;
