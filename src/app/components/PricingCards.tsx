import { CheckIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import CheckoutButton from "./CheckoutButton";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Starter",
    id: "starter_tier",
    href: "#",
    priceMonthly: null,
    description: "Get chatting right away with anyone, anywhere!",
    features: [
      "20 Message Chat Limit in Chats",
      "2 Participant limit in Chat",
      "3 Chat Rooms limit",
      "Supports 2 languages",
      "48-hour support response time",
    ],
  },
  {
    name: "Pro",
    id: "pro_tier",
    href: "#",
    priceMonthly: "$5.99",
    description: "Unlock the Full Potential with Pro!",
    features: [
      "Unlimited Messages in Chats",
      "Unlimited Participants in Chats",
      "Unlimited Chat Rooms",
      "Supports up to 10 Languages",
      "Multimedia support in chats (coming soon)",
      "1-hour, dedicated support response time",
      "Early access to New Features",
    ],
  },
];

const PricingCards = ({ redirect }: { redirect: boolean }) => {
  return (
    <div>
      <div className="mx-auto grid max-w-xs grid-cols-1 gap-8 md:max-w-md lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10"
          >
            <div>
              <h3
                id={tier.id}
                className="text-base font-semibold leading-7 text-indigo-600"
              >
                {tier.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-x-2">
                {tier.priceMonthly ? (
                  <>
                    <span className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                      {tier.priceMonthly}
                    </span>
                    <span className="text-base font-semibold leading-7 text-gray-600">
                      /month
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                    Free
                  </span>
                )}
              </div>

              <p className="mt-6 text-base leading-7 text-gray-600">
                {tier.description}
              </p>

              <ul
                role="list"
                className="mt-10 space-y-4 text-sm leading-6 text-gray-600"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-indigo-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {redirect ? (
              <Button
                asChild
                className="mt-8 bg-indigo-600 text-white hover:bg-indigo-500"
              >
                <Link href="/register">Get Started Today</Link>
              </Button>
            ) : (
              tier.id && <CheckoutButton />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingCards;
