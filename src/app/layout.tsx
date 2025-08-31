import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
import NavBar from "@/components/UI/NavBar";
import Footer from "@/components/UI/Footer";

export const metadata: Metadata = {
  title: "RedFreelance",
  description: "Conectando talento con oportunidades",
  icons: {
    icon: '/favicon.ico',
  }
};

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${inter.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NavBar />
            <div className="mt-6 min-h-[40vh]">
              {children}
            </div>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
