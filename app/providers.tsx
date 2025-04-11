"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { ThemeProvider } from "./context/ThemeContext";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setCredentials } from "@/features/auth/userSlice";
import { Toaster } from "react-hot-toast";

// Component to handle initialization logic
function InitializeAuthState() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.id) {
          dispatch(setCredentials({ user, token }));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  // This component doesn't render anything itself
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  // State to track client-side mounting
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true only after mounting on the client
    setIsClient(true);
  }, []);

  return (
    <Provider store={store}>
      {/* Conditionally render the initializer only on the client */}
      {isClient && <InitializeAuthState />}
      <ThemeProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#2c3e50",
              color: "#fff",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}
