import * as React from "react"
import { cn } from "@/utils"
const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input type={type}
    className={cn("flex h-10 w-full bg-[#141414] border border-[#2A2A2A] rounded-xl px-3 py-2 text-sm text-[#F8F8F8] placeholder:text-[#F8F8F8]/30 focus:outline-none focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C]/30 disabled:opacity-50 font-body transition-colors", className)}
    ref={ref} {...props} />
))
Input.displayName = "Input"
export { Input }
