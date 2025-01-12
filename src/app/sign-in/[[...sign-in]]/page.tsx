import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center">
      <SignIn />
    </div>
  );
}
