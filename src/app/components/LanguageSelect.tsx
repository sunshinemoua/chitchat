"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguageStore, userSubscriptionStore } from "../../../store/store";
import { usePathname } from "next/navigation";
import { LanguagesSupportedMap } from "../../../types/Languages";
import { useState } from "react";

const languageFormSchema = z.object({
  languageQuery: z.string({
    required_error: "Please select a language.",
  }),
});

const SearchLanguage = () => {
  const { language, setLanguage, getLanguages, getUnsupportedLanguages } =
    useLanguageStore.getState();
  const subscription = userSubscriptionStore((state) => state.subscription);
  const pathName = usePathname();
  const [isPopoverOpen, setIsPopOverOpen] = useState(false);

  const isPro =
    subscription?.role == "pro" && subscription?.status === "active";

  const isChatPage = pathName.includes("/chat");

  // Define form
  const form = useForm<z.infer<typeof languageFormSchema>>({
    resolver: zodResolver(languageFormSchema),
  });

  const onSubmit = () => {
    setLanguage(language);
  };

  return (
    isChatPage && (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Input for language search */}
          <FormField
            control={form.control}
            name="languageQuery"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                {/* Component for dropdown */}
                <Popover open={isPopoverOpen} onOpenChange={setIsPopOverOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {/* Render selected or default language */}
                        {field.value || LanguagesSupportedMap[language]}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    {/* Dropdown list of languages */}
                    <Command>
                      <CommandInput placeholder="Search language..." />
                      <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {getLanguages(isPro).map((language) => (
                            // If selected, update form value, state and close dropdown
                            <CommandItem
                              value={LanguagesSupportedMap[language]}
                              key={language}
                              onSelect={() => {
                                form.setValue(
                                  "languageQuery",
                                  LanguagesSupportedMap[language]
                                );
                                setLanguage(language);
                                setIsPopOverOpen(false);
                              }}
                            >
                              {LanguagesSupportedMap[language]}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  LanguagesSupportedMap[language] ===
                                    field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                          {/* If not pro, render list of languages as disabled with tag */}
                          {getUnsupportedLanguages(isPro).map((language) => (
                            <CommandItem
                              value={LanguagesSupportedMap[language]}
                              key={language}
                              disabled
                            >
                              {LanguagesSupportedMap[language]} (PRO)
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  );
};

export default SearchLanguage;
