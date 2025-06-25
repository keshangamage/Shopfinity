import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase.js";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update user profile (display name, photo)
  const updateUserProfile = (user, profile) => {
    return updateProfile(user, profile);
  };

  // Login function
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google sign in
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Logout function
  const logout = () => {
    return signOut(auth);
  };

  // Password reset function
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  useEffect(() => {
    let unsubscribe;

    try {
      // Try to retrieve the user from localStorage first
      const savedUser = localStorage.getItem("shopfinity_auth_user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setCurrentUser(parsedUser);
        } catch (e) {
          console.error("Error parsing saved user:", e);
          localStorage.removeItem("shopfinity_auth_user");
        }
      }

      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setCurrentUser(user);

          // Save the user to localStorage
          if (user) {
            const userData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
            };
            localStorage.setItem(
              "shopfinity_auth_user",
              JSON.stringify(userData)
            );
          } else {
            localStorage.removeItem("shopfinity_auth_user");
          }

          setLoading(false);
        },
        (error) => {
          console.error("Auth state change error:", error);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Failed to set up auth listener:", error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const isAdmin = () => {
    if (!currentUser) return false;

    const adminEmails = [
      "admin@shopfinity.com",
      "keshan.gimhana.gamage@gmail.com",
    ]; // admin emails

    return adminEmails.includes(currentUser.email);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    signInWithGoogle,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
