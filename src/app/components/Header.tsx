import React from "react";
import Logo from "./Logo";
import { DarkModeToggle } from "./DarkModeToggle";
import UserButton from "./UserButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import { MessagesSquareIcon } from "lucide-react";
import Link from "next/link";

const Header = async () => {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900">
      <nav className="flex flex-col sm:flex-row items-center p-5 pl-2 bg-white dark:bg-gray-900 max-w-7xl mx-auto">
        <Logo />

        <div className="flex-1 flex items-center justify-end space-x-4">
          {/* Language Selection */}

          {/* Session &&  (
            ...) */}

          {/* If user is authenticated, render messages icon. If not, render pricing button */}
          {session ? (
            <>
              <Link href={"/chat"} prefetch={false}>
                <MessagesSquareIcon className="text-black dark:text-white" />
              </Link>
            </>
          ) : (
            <Link href={"/pricing"}>Pricing</Link>
          )}

          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* User Button */}
          <UserButton />
        </div>
      </nav>

      {/* Upgrade Banner */}
    </div>
  );
};

export default Header;
