"use client";

import * as React from "react";
import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";
import { NavMain } from "@/components/scaffolding/layout/nav/nav-main";
/* import { NavProjects } from "@/components/nav-projects"; */
/* import { NavSecondary } from "@/components/nav-secondary"; */
/* import { NavUser } from "@/components/nav-user"; */
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Accounts",
      url: "/dashboard/accounts",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Clubs",
          url: "/dashboard/accounts/clubs",
        },
        {
          title: "Associations",
          url: "/dashboard/accounts/associations",
        },
      ],
    },
    {
      title: "Schedulers",
      url: "/dashboard/schedulers",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "/dashboard/schedulers/genesis",
        },
        {
          title: "Explorer",
          url: "/dashboard/schedulers/explorer",
        },
        {
          title: "Quantum",
          url: "/dashboard/schedulers/quantum",
        },
      ],
    },
    {
      title: "Revenue",
      url: "/dashboard/revenue",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "/dashboard/revenue/introduction",
        },
        {
          title: "Get Started",
          url: "/dashboard/revenue/get-started",
        },
        {
          title: "Tutorials",
          url: "/dashboard/revenue/tutorials",
        },
        {
          title: "Changelog",
          url: "/dashboard/revenue/changelog",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
        {
          title: "Team",
          url: "/dashboard/settings/team",
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
        },
        {
          title: "Limits",
          url: "/dashboard/settings/limits",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Fixtura</span>
                <span className="truncate text-xs">Administration</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}Fixtura</SidebarFooter>
    </Sidebar>
  );
}
