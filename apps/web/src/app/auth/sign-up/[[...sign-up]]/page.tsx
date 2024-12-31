import React from "react";
import { SignUp as ClerkSignUp } from "@clerk/nextjs";

type Props = {};

const SignUp: React.FC<Props> = ({}) => {
  return <ClerkSignUp signInUrl="/auth/sign-in" />;
};

export default SignUp;
