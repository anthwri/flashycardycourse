"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteDeck } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Deck {
  id: number;
  title: string;
  description: string | null;
}

interface DeckDeleteModalProps {
  deck: Deck;
  cardCount: number;
  trigger?: React.ReactNode;
}

export function DeckDeleteModal({ deck, cardCount, trigger }: DeckDeleteModalProps) {
  const [open, setOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const REQUIRED_TEXT = "Delete Deck";
  const isConfirmationValid = confirmationText === REQUIRED_TEXT;

  const handleDelete = () => {
    if (!isConfirmationValid) return;

    startTransition(async () => {
      try {
        const result = await deleteDeck({
          id: deck.id,
        });

        if (result.success) {
          setOpen(false);
          // Redirect to dashboard since the deck page will no longer exist
          router.push("/dashboard");
        } else {
          console.error("Failed to delete deck:", result.error);
          // TODO: Add proper error handling/toast
        }
      } catch (error) {
        console.error("Error deleting deck:", error);
      }
    });
  };

  const resetForm = () => {
    setConfirmationText("");
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Deck
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Deck
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the deck 
            "{deck.title}" and all {cardCount} flashcard{cardCount !== 1 ? 's' : ''} within it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Deck Information */}
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <h4 className="font-semibold text-sm mb-2">{deck.title}</h4>
            {deck.description && (
              <p className="text-sm text-muted-foreground mb-2">{deck.description}</p>
            )}
            <div className="text-xs text-muted-foreground">
              Contains {cardCount} flashcard{cardCount !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              To confirm deletion, type <span className="font-mono font-semibold">"{REQUIRED_TEXT}"</span> below:
            </Label>
            <Input
              id="confirmation"
              type="text"
              placeholder="Type to confirm deletion..."
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              disabled={isPending}
              className="font-mono"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button 
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || !isConfirmationValid}
          >
            {isPending ? "Deleting..." : "Delete Deck"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
