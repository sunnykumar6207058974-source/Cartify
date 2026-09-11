import { useEffect, useContext } from "react";
import { useUser, useClerk } from "@clerk/react";
import { CartContext } from "../../context/CartContext";

/**
 * ClerkAuthSync
 * Automatically synchronizes Clerk authentication state with Cartify's internal CartContext.
 * Ensures orders, wishlist, cart, and profile seamlessly recognize the Clerk authenticated user.
 */
export default function ClerkAuthSync() {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { user: appUser, loginUser, logoutUser } = useContext(CartContext);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && clerkUser) {
      const email = clerkUser.primaryEmailAddress?.emailAddress || "";
      const phone = clerkUser.primaryPhoneNumber?.phoneNumber || "";
      const name =
        clerkUser.fullName ||
        clerkUser.firstName ||
        clerkUser.username ||
        email.split("@")[0] ||
        "User";
      const avatar = clerkUser.imageUrl;

      // Only sync if user changed or not logged in yet
      if (!appUser || !appUser.isLoggedIn || appUser.email !== email) {
        loginUser({
          name,
          email,
          phone,
          avatar,
          isClerk: true,
        });
      }
    } else if (!isSignedIn && appUser?.isClerk) {
      // User signed out from Clerk session
      logoutUser();
    }
  }, [isLoaded, isSignedIn, clerkUser, appUser?.isLoggedIn]);

  return null;
}
