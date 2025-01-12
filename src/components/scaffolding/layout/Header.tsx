import { SignInButton } from "@clerk/nextjs";

import { SignedOut } from "@clerk/nextjs";

import { UserButton } from "@clerk/nextjs";

import { SignedIn } from "@clerk/nextjs";
import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        {/*  <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" /> */}
        <span className="text-lg font-bold">Fixtura Admin</span>
      </div>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
