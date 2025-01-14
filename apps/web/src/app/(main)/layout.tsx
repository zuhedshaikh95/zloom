import { Navbar } from "@/components/global";
import React from "react";

type Props = Readonly<{
  children: React.ReactNode;
}>;

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <main className="flex flex-col p-10 h-screen w-screen xl:px-0 container">
      <Navbar />
      {children}
    </main>
  );
};

export default MainLayout;
