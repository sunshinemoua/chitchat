import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../../../auth";
import PricingCards from "@/app/components/PricingCards";

const RegisterPage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="isolate h-full pb-40 overflow-hidden dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 text-white text-center lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Let&apos;s handle your membership{" "}
            {session?.user?.name?.split(" ")?.[0]}!
          </p>
        </div>
        <div className="relative">
          <svg
            viewBox="0 0 1208 1024"
            className="absolute -top-10 left-1/2 -z-10 h-[64rem] -translate-x-1/2 [mask-image:linear-gradient(closest-side,transparent,white,transparent)] sm:-top-12 md:-top-20 lg:-top-12 xl:top-0"
          >
            <rect
              x={0}
              y={0}
              width={1208}
              height={1024}
              fill="url(#linear-gradient-pricing)"
            />
            <defs>
              <linearGradient
                id="linear-gradient-pricing"
                gradientTransform="rotate(90)"
              >
                <stop offset="0%" stopColor="rgba(119, 117, 214, 0)" />
                <stop offset="20%" stopColor="#7775D6" />
                <stop offset="40%" stopColor="#E935C1" />
                <stop offset="80%" stopColor="rgba(137, 82, 150, 0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <PricingCards redirect={false} />
    </div>
  );
};

export default RegisterPage;
