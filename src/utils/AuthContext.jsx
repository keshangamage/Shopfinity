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
import { auth, db } from "./firebase.js";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Sign up function
  const signup = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Create user profile in Firestore
    await createUserProfile(result.user);
    return result;
  };

  // Update user profile (display name, photo)
  const updateUserProfile = (user, profile) => {
    return updateProfile(user, profile);
  };

  // Login function
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Update last login
    await updateLastLogin(result.user.uid);
    return result;
  };

  // Google sign in
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    await createUserProfile(result.user);
    return result;
  };

  const createUserProfile = async (user) => {
    try {
      const userDoc = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDoc);

      if (!docSnap.exists()) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          role: "customer",
          status: "active",
          createdAt: Timestamp.now(),
          lastLoginAt: Timestamp.now(),
          emailVerified: user.emailVerified,
        };

        await setDoc(userDoc, userData);
      } else {
        // Update existing profile
        await updateDoc(userDoc, {
          lastLoginAt: Timestamp.now(),
          emailVerified: user.emailVerified,

          ...(user.displayName && { displayName: user.displayName }),
          ...(user.photoURL && { photoURL: user.photoURL }),
        });
      }
    } catch (error) {
      console.error("Error creating/updating user profile:", error);
    }
  };

  // Update last login
  const updateLastLogin = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, {
        lastLoginAt: Timestamp.now(),
      });
    } catch (error) {
      console.error("Error updating last login:", error);
    }
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

  useEffect(() => {
    let unsubscribe;

    if (currentUser) {
      setProfileLoading(true);
      const userDocRef = doc(db, "users", currentUser.uid);

      // Listen for role/status changes in real time so auth gating stays accurate
      unsubscribe = onSnapshot(
        userDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const profileData = snapshot.data();
            setUserProfile(profileData);
            localStorage.setItem(
              "shopfinity_auth_profile",
              JSON.stringify(profileData)
            );
          } else {
            setUserProfile(null);
            localStorage.removeItem("shopfinity_auth_profile");
          }
          setProfileLoading(false);
        },
        (error) => {
          console.error("Error subscribing to user profile:", error);
          setUserProfile(null);
          setProfileLoading(false);
        }
      );
    } else {
      setUserProfile(null);
      localStorage.removeItem("shopfinity_auth_profile");
      setProfileLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  const isAdmin = () => {
    if (!currentUser) return false;

    if (userProfile?.role) {
      return userProfile.role === "admin";
    }

    try {
      const storedProfile = localStorage.getItem("shopfinity_auth_profile");
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile);
        if (parsedProfile?.role) {
          return parsedProfile.role === "admin";
        }
      }
    } catch (error) {
      console.warn("Failed to parse stored auth profile:", error);
    }

    const adminEmails = [
      "admin@shopfinity.com",
      "keshan.gimhana.gamage@gmail.com",
    ];

    return adminEmails.includes(currentUser.email);
  };

  const value = {
    currentUser,
    userProfile,
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
      {!loading && !profileLoading && children}
    </AuthContext.Provider>
  );
};
