import TechstacksLogo from "@/assets/techstacks-logo.png";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export default function CompanyLogo({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={
      cn(
        'size-16 flex items-center',
        className
      )
    }
      {...props}
    >
      <img src={TechstacksLogo} alt="Techstacks logo" />
    </div >
  )
}
