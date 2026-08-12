import { useQuery } from "@tanstack/react-query";
import { auth } from "@/api/supabaseClient";

const ADMIN_EMAIL = "athleterxperformance@gmail.com";

export function useSubscription() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => auth.me(),
    staleTime: 1000 * 60 * 5,
  });

  // Admin account — full access to everything
  const isAdmin = user?.email === ADMIN_EMAIL;

  const plan = isAdmin ? "coach" : (user?.subscription_plan || "free");
  const isPremium = isAdmin || plan === "premium" || plan === "coach";
  const isCoach = isAdmin || plan === "coach";
  const isFree = !isAdmin && plan === "free";

  return { user, plan, isPremium, isCoach, isFree, isLoading, isAdmin };
}
