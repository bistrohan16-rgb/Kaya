import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/utils"
const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)} {...props} />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName
const SheetContent = React.forwardRef(({ className, children, side = "right", ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref}
      className={cn("fixed z-50 bg-[var(--bg)] border-l border-[var(--border)] p-6 shadow-xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 inset-y-0 right-0 h-full w-full sm:max-w-lg overflow-y-auto data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right", className)} {...props}>
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-lg opacity-70 text-[var(--text)] hover:opacity-100 hover:bg-[var(--border)] p-1 transition-all">
        <X className="h-5 w-5" /><span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName
const SheetHeader = ({ className, ...props }) => <div className={cn("flex flex-col space-y-2", className)} {...props} />
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn("text-2xl font-display text-[var(--text)]", className)} {...props} />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName
export { Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle }
