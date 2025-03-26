import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/features/AuthProvider";
import { Inter } from "next/font/google";
// import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import "./globals.css"; 
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OkhlaDastarkhan Shop",
  description: "Okhladastarkhan Shop register your shop and recive order online",
};

export default async function RootLayout({ children }) {
  // Fetch session from the server
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
