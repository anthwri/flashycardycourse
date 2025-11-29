import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@/components/auth-components";

export default async function HomePage() {
  const { userId } = await auth();

  // If user is already logged in, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            FlashyCardy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your personal flashcard platform
          </p>
        </div>
        
        <div className="flex gap-4 justify-center pt-4">
          <SignInButton />
          <SignUpButton />
        </div>
      </div>
    </div>
  );
}