import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { X } from "lucide-react"
import { cn } from "@/utils"
const ToastProvider = ToastPrimitives.Provider
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport ref={ref} className={cn("fixed top-4 right-4 z-[100] flex max-h-screen w-full max-w-sm flex-col gap-2", className)} {...props} />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName
const Toast = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Root ref={ref} className={cn("group relative flex w-full items-center justify-between overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg text-[var(--text)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80", className)} {...props} />
))
Toast.displayName = ToastPrimitives.Root.displayName
const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close ref={ref} className={cn("absolute right-2 top-2 rounded-md p-1 text-[var(--text)]/50 hover:text-[var(--text)]", className)} toast-close="" {...props}>
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold text-[#1B7A4A]", className)} {...props} />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm text-[var(--text)]/70", className)} {...props} />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName
export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose }
