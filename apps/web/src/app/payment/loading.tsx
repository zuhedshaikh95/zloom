import { Loader } from "@/components/global";

export default async function PaymentLoading() {
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <Loader className="w-8 h-8" />
    </div>
  );
}
