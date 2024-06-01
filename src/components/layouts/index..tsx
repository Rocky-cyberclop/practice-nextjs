import React from "react";
import { Toaster } from "../ui/sonner";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

interface IRootProps {
  children: React.ReactNode;
}

export const RootLayout = ({ children }: IRootProps) => {
  return (
    <>
      <main className={cn("flex flex-col gap-2 p-10", inter.className)}>
        {children}
      </main>
      <Toaster />
    </>
  );
};
