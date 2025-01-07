"use client";
import React from "react";
import { useLanguageStore, userSubscriptionStore } from "../../../store/store";
import { usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import {
  LanguagesSupported,
  LanguagesSupportedMap,
} from "../../../types/Languages";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link";

const LanguageSelect = () => {
  const { language, setLanguage, getLanguages, getUnsupportedLanguages } =
    useLanguageStore.getState();

  const subscription = userSubscriptionStore((state) => state.subscription);
  const isPro =
    subscription?.role == "pro" && subscription?.status === "active";

  const pathName = usePathname();
  const isChatPage = pathName.includes("/chat");

  return (
    isChatPage && (
      <div>
        <Select
          onValueChange={(value: LanguagesSupported) => setLanguage(value)}
        >
          <SelectTrigger className="w-[150px] text-black dark:text-white">
            <SelectValue placeholder={LanguagesSupportedMap[language]} />
          </SelectTrigger>

          <SelectContent>
            {subscription === undefined ? (
              <LoadingSpinner />
            ) : (
              <>
                {getLanguages(isPro).map((language) => (
                  <SelectItem key={language} value={language}>
                    {LanguagesSupportedMap[language]}
                  </SelectItem>
                ))}
                {getUnsupportedLanguages(isPro).map((language) => (
                  <Link href={"/register"} key={language} prefetch={false}>
                    <SelectItem
                      value={language}
                      disabled
                      className="bg-gray-300/50 text-gray-500 dark:text-white py-2 my-1"
                    >
                      {LanguagesSupportedMap[language]} (PRO)
                    </SelectItem>
                  </Link>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    )
  );
};

export default LanguageSelect;
