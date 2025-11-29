"use client";

import { useState, useTransition, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { updateDeck } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Deck {
  id: number;
  title: string;
  description: string | null;
}

interface DeckEditModalProps {
  deck: Deck;
  trigger?: React.ReactNode;
}

export function DeckEditModal({ deck, trigger }: DeckEditModalProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(deck.title);
  const [description, setDescription] = useState(deck.description || "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Reset form when deck changes or modal opens
  useEffect(() => {
    if (open) {
      setTitle(deck.title);
      setDescription(deck.description || "");
    }
  }, [open, deck.title, deck.description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateDeck({
          id: deck.id,
          title: title.trim(),
          description: description.trim() || undefined,
        });

        if (result.success) {
          setOpen(false);
          router.refresh();
        } else {
          console.error("Failed to update deck:", result.error);
          // TODO: Add proper error handling/toast
        }
      } catch (error) {
        console.error("Error updating deck:", error);
      }
    });
  };

  const resetForm = () => {
    setTitle(deck.title);
    setDescription(deck.description || "");
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
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit Deck
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Deck</DialogTitle>
            <DialogDescription>
              Update your deck's title and description. Choose a clear title that 
              helps you identify the content and purpose of this flashcard deck.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Deck Title</Label>
              <Input
                id="edit-title"
                placeholder="Enter deck title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isPending}
                required
                maxLength={255}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                placeholder="Add a description to help you remember what this deck covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={4}
                disabled={isPending}
                maxLength={1000}
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
              type="submit" 
              disabled={isPending || !title.trim()}
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
