import { useEffect } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useAuthStore } from "../store/authStore";

export function ClerkSync() {
  const { user: clerkUser, isLoaded } = useUser();
  const clerk = useClerk();

  useEffect(() => {
    if (!isLoaded) return;

    if (clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || "";
      const name = clerkUser.fullName || clerkUser.username || "Clerk User";
      const avatar = clerkUser.imageUrl;
      const role = (clerkUser.unsafeMetadata?.role as "rent" | "buy") || null;

      useAuthStore.setState({
        user: {
          id: clerkUser.id,
          name,
          email,
          role,
          provider: clerkUser.externalAccounts.length > 0 ? "google" : "local",
          avatar,
        },
      });
    } else {
      useAuthStore.setState({ user: null });
    }
  }, [clerkUser, isLoaded]);

  useEffect(() => {
    useAuthStore.setState({
      logout: () => clerk.signOut(),
      openAuth: (tab = "login") => {
        if (tab === "register") {
          clerk.openSignUp();
        } else {
          clerk.openSignIn();
        }
      },
      setRole: async (role) => {
        if (clerkUser) {
          await clerkUser.update({
            unsafeMetadata: {
              ...clerkUser.unsafeMetadata,
              role,
            },
          });
        }
      },
    });
  }, [clerk, clerkUser]);

  return null;
}
