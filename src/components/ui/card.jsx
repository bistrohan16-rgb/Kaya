import * as React from "react"
import { cn } from "@/utils"
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("bg-[#162232] border border-[#2A3F58] rounded-2xl", className)} {...props} />
))
Card.displayName = "Card"
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5", className)} {...props} />
))
CardHeader.displayName = "CardHeader"
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-display text-xl text-[#F8F8F8]", className)} {...props} />
))
CardTitle.displayName = "CardTitle"
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"
export { Card, CardHeader, CardTitle, CardContent }
