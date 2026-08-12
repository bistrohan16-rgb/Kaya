import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/utils"
const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger ref={ref}
    className={cn("flex h-10 w-full items-center justify-between rounded-xl bg-[var(--card)] border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[#1B7A4A] disabled:opacity-50 [&>span]:line-clamp-1 font-body transition-colors", className)} {...props}>
    {children}
    <SelectPrimitive.Icon asChild><ChevronDown className="h-4 w-4 opacity-50" /></SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content ref={ref}
      className={cn("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--text)] shadow-xl shadow-black/50 data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)}
      position={position} {...props}>
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = "SelectContent"
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item ref={ref}
    className={cn("relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm text-[var(--text)] outline-none hover:bg-[var(--border)] focus:bg-[var(--border)] data-[disabled]:opacity-50 font-body transition-colors", className)} {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator><Check className="h-4 w-4 text-[#1B7A4A]" /></SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = "SelectItem"
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem }
