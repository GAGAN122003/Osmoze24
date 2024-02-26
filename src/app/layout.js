import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthContextProvider } from "./firebase/page";
import { Toaster } from "react-hot-toast";
import "./styles/background.scss";
import "./styles/globals.css";
import Script from "next/script";
import BackgroundEffect from "./ui/BackgroundEffect";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Osmoze",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthContextProvider>
        <body className="flex flex-col m-0 min-h-screen">
          <Navbar />
          <div className="background-container">
            <BackgroundEffect />
            <div className="children-container">{children}</div>
          </div>

          <Footer />
          <Script src="script.js"></Script>
        </body>

        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            success: {
              duration: 2000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "#fff",
              color: "#374151",
              marginBottom: "3px",
            },
          }}
        />
      </AuthContextProvider>
    </html>
  );
}
