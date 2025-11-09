"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Network,
  CalendarClock,
  FileCode,
  Trophy,
  GraduationCap,
  BarChart3,
  TestTube,
  FlaskConical,
  DollarSign,
  Mail,
  CalendarDays,
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
import { useContactFormSubmissionsData } from "@/hooks/contact-form/useContactFormSubmissions";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Get unseen contact form submissions count
  const { data: contactFormData } = useContactFormSubmissionsData();
  const unseenCount =
    contactFormData?.filter((submission) => !submission.hasSeen).length ?? 0;

  const data = {
    mainNav: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
      },
    ],
    accountsNav: [
      {
        title: "Accounts",
        url: "/dashboard/accounts",
        icon: Users,
        isActive: false,
      },
      {
        title: "Clubs",
        url: "/dashboard/accounts/club",
        icon: Building2,
        isActive: false,
      },
      {
        title: "Associations",
        url: "/dashboard/accounts/association",
        icon: Network,
        isActive: false,
      },
    ],
    renderNav: [
      {
        title: "Schedulers",
        url: "/dashboard/schedulers",
        icon: CalendarClock,
        isActive: true,
      },
      {
        title: "Renders",
        url: "/dashboard/renders",
        icon: FileCode,
        isActive: true,
      },
    ],
    sportsDataNav: [
      /*  {
        title: "Teams",
        url: "/dashboard/teams",
        icon: UsersRound,
        isActive: true,
      }, */
      {
        title: "Competitions",
        url: "/dashboard/competitions",
        icon: Trophy,
        isActive: true,
      },
      {
        title: "Grades",
        url: "/dashboard/grades",
        icon: GraduationCap,
        isActive: true,
      },
      {
        title: "Fixtures",
        url: "/dashboard/fixtures",
        icon: CalendarDays,
        isActive: true,
      },
    ],
    financialNav: [
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
        isActive: true,
      },
      {
        title: "Budget & Costings",
        url: "/dashboard/budget",
        icon: DollarSign,
        isActive: true,
      },
    ],

    communicationNav: [
      {
        title: "Contact Forms",
        url: "/dashboard/contact",
        icon: Mail,
        isActive: true,
        badge: unseenCount,
      },
    ],
    testingNav: [
      {
        title: "Account Scraper Tests",
        url: "/dashboard/fetchAccountTests",
        icon: TestTube,
        isActive: true,
      },
      {
        title: "Result Scraper Tests",
        url: "/dashboard/fetchTests",
        icon: FlaskConical,
        isActive: true,
      },
    ],
  };

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
      <SidebarContent className="gap-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <NavMain items={data.mainNav} title="Main" />
        <NavMain items={data.accountsNav} title="Accounts" />
        <NavMain items={data.renderNav} title="Renders" />
        <NavMain items={data.sportsDataNav} title="Sports Data" />
        <NavMain items={data.financialNav} title="Financial" />
        <NavMain items={data.communicationNav} title="Communication" />
        <NavMain items={data.testingNav} title="Testing" />
      </SidebarContent>
      <SidebarFooter>
        <S className="text-center">Fixtura</S>
      </SidebarFooter>
    </Sidebar>
  );
}
