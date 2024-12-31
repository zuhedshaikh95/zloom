import React from "react";

type Props = Readonly<{
  children: React.ReactNode;
}>;

const AuthLayout: React.FC<Props> = ({ children }) => {
  return <main className="container h-screen flex justify-center items-center">{children}</main>;
};

export default AuthLayout;
