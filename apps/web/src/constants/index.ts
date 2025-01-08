import { Bell, CreditCard, Home, LibraryBig, LucideIcon, Settings } from "lucide-react";

export const mapWorkspaceMenuItems = (workspaceId: string): { title: string; href: string; icon: LucideIcon }[] => {
  return [
    {
      title: "Home",
      href: `/dashboard/${workspaceId}/home`,
      icon: Home,
    },
    {
      title: "My workspace",
      href: `/dashboard/${workspaceId}`,
      icon: LibraryBig,
    },
    {
      title: "Notifications",
      href: `/dashboard/${workspaceId}/notifications`,
      icon: Bell,
    },
    {
      title: "Billing",
      href: `/dashboard/${workspaceId}/billing`,
      icon: CreditCard,
    },
    {
      title: "Settings",
      href: `/dashboard/${workspaceId}/settings`,
      icon: Settings,
    },
  ];
};
