import { cn } from "@/libs/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  icon: LucideIcon;
  title: string;
  href: string;
  selected: boolean;
  notifications?: number;
};

const SidebarItem: React.FC<Props> = ({ href, icon: Icon, selected, title, notifications }) => {
  return (
    <li className="cursor-pointer my-1">
      <Link
        className={cn("flex items-center justify-between group rounded-lg hover:bg-[#1D1D1D]", {
          "bg-[#1D1D1D]": selected,
        })}
        href={href}
      >
        <div className="flex items-center gap-2 transition-all p-2 cursor-pointer">
          <Icon color="#545454" size={20} />
          <span
            className={cn("font-medium group-hover:text-[#9D9D9D] transition-all truncate w-32 text-sm", {
              "text-[#9D9D9D]": selected,
              "text-[#545454]": !selected,
            })}
          >
            {title}
          </span>
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;
