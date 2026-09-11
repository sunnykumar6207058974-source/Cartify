import { useContext } from "react";
import { SignIn } from "@clerk/react";
import { dark } from "@clerk/themes";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CartContext } from "../context/CartContext";

function Login() {
  const { darkMode } = useContext(CartContext);

  return (
    <div className="page-wrapper min-h-screen flex flex-col">
      <Navbar />
      <main
        className="clerk-auth-page"
        style={{
          minHeight: "calc(100vh - 160px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
          background: darkMode
            ? "radial-gradient(ellipse at top, #1e1b4b 0%, #0b0f19 100%)"
            : "radial-gradient(ellipse at top, #e0e7ff 0%, #f8fafc 100%)",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/register"
            fallbackRedirectUrl="/"
            appearance={{
              baseTheme: darkMode ? dark : undefined,
              variables: {
                colorPrimary: "#4f46e5",
                colorTextOnPrimaryBackground: "#ffffff",
                borderRadius: "14px",
              },
              elements: {
                card: {
                  boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)",
                  border: darkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                },
              },
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Login;