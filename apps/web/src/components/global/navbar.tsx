import { Button } from "@/components/ui";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const Navbar: React.FC<Props> = ({}) => {
  return (
    <nav className="flex w-full justify-between items-center">
      <div className="text-3xl font-semibold flex items-center gap-x-3">
        <Menu className="w-6 h-6" />
        <Image src="/assets/zloom-logo.png" width={40} height={40} alt="zloom-logo" />
        zloom
      </div>

      <div className="hidden gap-x-10 items-center lg:flex">
        <Link href="/" className="bg-[#7320DD] py-2 px-5 font-semibold text-lg rounded-full hover:bg-[#7320DD]/80">
          Home
        </Link>
        <Link href="/">Pricing</Link>
        <Link href="/">Contact</Link>
      </div>

      <Link href="/auth/sign-in">
        <Button>
          <User fill="#000" />
          Sign In
        </Button>
      </Link>
    </nav>
  );
};

export default Navbar;
