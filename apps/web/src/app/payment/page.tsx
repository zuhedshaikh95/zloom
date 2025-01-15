import { completeSubscription } from "@/actions/user";
import { redirect } from "next/navigation";

type Props = {
  searchParams: { session_id?: string; cancel?: string };
};

export default async function Payment({ searchParams }: Props) {
  if (searchParams.session_id) {
    const customer = await completeSubscription(searchParams.session_id);

    if (customer.status) {
      return redirect("/auth/callback");
    }
  }

  if (searchParams.cancel) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full">
        <h4 className="text-4xl font-bold">404</h4>
        <p className="text-lg text-center">Something went wrong during checkout</p>
      </div>
    );
  }

  return <div>Payment</div>;
}
