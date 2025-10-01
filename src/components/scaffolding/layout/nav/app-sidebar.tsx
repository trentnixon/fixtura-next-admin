"use client";

import * as React from "react";
import {
  SquareTerminal,
  CircleUser,
  ShieldHalf,
  Component,
  ChartCandlestick,
  CalendarSync,
  Pickaxe,
  TestTube,
} from "lucide-react";
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
import { S } from "@/components/type/type";

const data = {
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
      icon: CircleUser,
      isActive: false,
    },
    {
      title: "Clubs",
      url: "/dashboard/accounts/club",
      icon: CircleUser,
      isActive: false,
    },
    {
      title: "Associations",
      url: "/dashboard/accounts/association",
      icon: CircleUser,
      isActive: false,
    },
  ],
  renderNav: [
    {
      title: "Schedulers",
      url: "/dashboard/schedulers",
      icon: CalendarSync,
      isActive: true,
    },
    {
      title: "Renders",
      url: "/dashboard/renders",
      icon: Pickaxe,
      isActive: true,
    },
  ],
  dataNav: [
    {
      title: "Teams",
      url: "/dashboard/teams",
      icon: ShieldHalf,
      isActive: true,
    },
    {
      title: "Competitions",
      url: "/dashboard/competitions",
      icon: Component,
      isActive: true,
    },
    {
      title: "Grades",
      url: "/dashboard/grades",
      icon: ChartCandlestick,
      isActive: true,
    },
    {
      title: "Result Scraper Tests",
      url: "/dashboard/fetchTests",
      icon: TestTube,
      isActive: true,
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
        <NavMain items={data.navMain} title="Platform" />
        <NavMain items={data.renderNav} title="Renders" />
        <NavMain items={data.dataNav} title="Data" />
      </SidebarContent>
      <SidebarFooter>
        <S className="text-center">Fixtura</S>
      </SidebarFooter>
    </Sidebar>
  );
}
