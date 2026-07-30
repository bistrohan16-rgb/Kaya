import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/utils"
const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-body", {
  variants: {
    variant: {
      default: "bg-[#B8960C]/20 text-[#B8960C] border border-[#B8960C]/30",
      secondary: "bg-[#2A3F58] text-[#F8F8F8]",
      destructive: "bg-red-900/30 text-red-400 border border-red-800/50",
      amber: "bg-[#C44A1A]/20 text-[#C44A1A] border border-[#C44A1A]/30",
      emerald: "bg-[#1E5C3A]/30 text-emerald-400 border border-[#1E5C3A]/50",
    },
  },
  defaultVariants: { variant: "default" },
})
function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}
export { Badge, badgeVariants }
