import { useQuery } from "@tanstack/react-query";
import { auth } from "@/api/supabaseClient";

export function useSubscription() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => auth.me(),
    staleTime: 1000 * 60 * 5,
  });
  const plan = user?.subscription_plan || "free";
  const isPremium = plan === "premium" || plan === "coach";
  const isCoach = plan === "coach";
  const isFree = plan === "free";
  return { user, plan, isPremium, isCoach, isFree, isLoading };
}
