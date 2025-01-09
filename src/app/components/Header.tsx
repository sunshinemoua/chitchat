import React from "react";
import Logo from "./Logo";
import { DarkModeToggle } from "./DarkModeToggle";
import UserButton from "./UserButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth";
import { MessagesSquareIcon } from "lucide-react";
import Link from "next/link";
import CreateChatButton from "./CreateChatButton";
import UpgradeBanner from "./UpgradeBanner";
import LanguageSelect from "./LanguageSelect";

const Header = async () => {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  console.log(session?.user);

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900">
      <nav className="flex flex-col sm:flex-row items-center p-5 pl-2 bg-white dark:bg-gray-900 max-w-7xl mx-auto">
        <Logo />

        <div className="flex-1 flex items-center justify-end space-x-4">
          <LanguageSelect />

          {/* If user is authenticated, render messages icon. If not, render pricing button */}
          {session ? (
            <>
              <Link href={"/chat"} prefetch={false}>
                <MessagesSquareIcon className="text-black dark:text-white" />
              </Link>
              <CreateChatButton />
            </>
          ) : (
            <Link href={"/pricing"}>Pricing</Link>
          )}

          <DarkModeToggle />

          <UserButton session={session} />
        </div>
      </nav>

      <UpgradeBanner />
    </div>
  );
};

export default Header;
