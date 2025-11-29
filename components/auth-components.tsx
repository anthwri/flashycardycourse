"use client";

import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignIn, SignUp, UserButton } from "@clerk/nextjs";

// Sign In Button with Modal - Following shadcn UI + Clerk modal pattern
export function SignInButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In to FlashyCardy</DialogTitle>
        </DialogHeader>
        <SignIn 
          routing="hash" 
          afterSignInUrl="/dashboard"
          redirectUrl="/dashboard"
        />
      </DialogContent>
    </Dialog>
  );
}

// Sign Up Button with Modal - Following shadcn UI + Clerk modal pattern  
export function SignUpButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          Sign Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign Up for FlashyCardy</DialogTitle>
        </DialogHeader>
        <SignUp 
          routing="hash" 
          afterSignUpUrl="/dashboard"
          redirectUrl="/dashboard"
        />
      </DialogContent>
    </Dialog>
  );
}

// User Profile Button with Sign-Out - Following shadcn UI + Clerk modal pattern
export function UserProfileButton() {
  return (
    <UserButton 
      afterSignOutUrl="/" 
      appearance={{
        elements: {
          avatarBox: "w-8 h-8 rounded-full",
        },
      }}
    />
  );
}
