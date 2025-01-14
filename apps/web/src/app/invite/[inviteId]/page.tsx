import { acceptInvite } from "@/actions/user";
import { redirect } from "next/navigation";

type Props = {
  params: {
    inviteId: string;
  };
};

export default async function Invite({ params }: Props) {
  const invite = await acceptInvite(params.inviteId);

  if (invite.code === 404) return redirect("/auth/sign-in");

  if (invite.code === 401) {
    return (
      <div className="h-screen container flex flex-col gap-y-2 justify-center items-center">
        <h2 className="text-3xl font-bold text-white">Not Authorized</h2>
        <p>You are not authorized to accept this invite</p>
      </div>
    );
  }

  if (invite.code === 200) return redirect("/auth/callback");

  return <div>{params.inviteId}</div>;
}
