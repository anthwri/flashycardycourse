import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { SignInButton, SignUpButton, UserProfileButton } from "@/components/auth-components";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flashy Cardy Course",
  description: "Interactive flashcard-based learning application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${poppins.variable} font-sans antialiased`}
        >
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-semibold">Flashy Cardy Course</h1>
              </div>
              <div className="flex items-center space-x-2">
                <SignedOut>
                  <SignInButton />
                  <SignUpButton />
                </SignedOut>
                <SignedIn>
                  <UserProfileButton />
                </SignedIn>
              </div>
            </div>
          </header>
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
