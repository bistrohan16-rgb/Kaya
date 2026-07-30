import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/utils"
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 font-body",
  {
    variants: {
      variant: {
        default: "bg-[#B8960C] text-[#0A1628] hover:bg-[#D4AA10]",
        outline: "border border-[#B8960C]/50 text-[#B8960C] bg-transparent hover:bg-[#B8960C]/10",
        ghost: "text-[#F8F8F8]/60 bg-transparent hover:text-[#F8F8F8] hover:bg-[#2A3F58]/50",
        destructive: "bg-red-900/50 text-red-300 border border-red-800 hover:bg-red-900",
        secondary: "bg-[#2A3F58] text-[#F8F8F8] hover:bg-[#3a5070]",
        link: "text-[#B8960C] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = "Button"
export { Button, buttonVariants }
