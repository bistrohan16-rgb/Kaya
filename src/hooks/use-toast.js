import { useState } from "react"
export function useToast() {
  const [toasts, setToasts] = useState([])
  const toast = ({ title, description, ...props }) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, title, description, ...props }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }
  return { toasts, toast }
}
