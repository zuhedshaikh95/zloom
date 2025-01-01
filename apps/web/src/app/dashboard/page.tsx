import { authenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const Dashboard: React.FC<Props> = async ({}) => {
  const auth = await authenticateUser();

  if ([200, 201].includes(auth.status)) {
    return redirect(`/dashboard/${auth.user?.workspaces[0].id}`);
  }

  if ([400, 404].includes(auth.status)) {
    return redirect("/auth/sign-in");
  }

  return <div>Dashboard</div>;
};

export default Dashboard;
