import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/utils"
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn("text-xs font-semibold tracking-widest uppercase text-[#1B7A4A] font-body", className)} {...props} />
))
Label.displayName = "Label"
export { Label }
