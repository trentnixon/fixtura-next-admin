import { ClerkProvider } from "@clerk/nextjs";
import { Heebo, Roboto, Roboto_Condensed } from "next/font/google";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/scaffolding/layout/nav/app-sidebar";
import CustomBreadcrumbs from "@/components/scaffolding/layout/Breadcrumbs";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { GlobalProvider } from "@/components/providers/GlobalContext";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fixtura Admin",
  description: "Fixtura Admin",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`  ${heebo.variable} ${roboto.variable} ${robotoCondensed.variable} antialiased `}
        >
          <QueryProvider>
            <GlobalProvider>
              <SidebarProvider>
                {userId && <AppSidebar />}
                <SidebarInset>
                  <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                      {userId && <SidebarTrigger className="-ml-1" />}
                      <Separator orientation="vertical" className="mr-2 h-4" />
                      <CustomBreadcrumbs />
                    </div>
                  </header>
                  <main className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
                    {children}
                  </main>
                </SidebarInset>
              </SidebarProvider>
              <Toaster />
            </GlobalProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
