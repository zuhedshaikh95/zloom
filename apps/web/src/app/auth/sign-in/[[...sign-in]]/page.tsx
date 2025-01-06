import React from "react";
import { SignIn as ClerkSignIn } from "@clerk/nextjs";

type Props = {};

const SignIn: React.FC<Props> = ({}) => {
  return <ClerkSignIn signUpUrl="/auth/sign-up" />;
};

export default SignIn;
