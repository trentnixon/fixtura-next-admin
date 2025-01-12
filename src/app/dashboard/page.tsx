import { auth } from "@clerk/nextjs/server";
import DataTest from "./components/DataTest";
//import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Retrieve the user's authentication details
  const { userId, redirectToSignIn } = await auth();

  // If the user is not authenticated, redirect to the sign-in page
  if (!userId) {
    redirectToSignIn({ returnBackUrl: "/dashboard" });
    return null; // Avoid rendering anything after redirect
  }

  return (
    <>
      <h1 className="text-xl font-bold">
        Welcome to the Fixtura Admin Dashboard
      </h1>
      <p>You are signed in as user: {userId}</p>
      <div className="flex items-center">
        {/*  <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" /> */}
        <span className="text-lg font-bold">Fixtura Admin</span>
      </div>{" "}
      <DataTest />
      <ul>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
      </ul>
    </>
  );
}
