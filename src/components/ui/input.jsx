import * as React from "react"
import { cn } from "@/utils"
const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input type={type}
    className={cn("flex h-10 w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text)]/30 focus:outline-none focus:border-[#1B7A4A] focus:ring-1 focus:ring-[#1B7A4A]/30 disabled:opacity-50 font-body transition-colors", className)}
    ref={ref} {...props} />
))
Input.displayName = "Input"
export { Input }
