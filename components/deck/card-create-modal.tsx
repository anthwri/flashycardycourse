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
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { createCard } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface CardCreateModalProps {
  deckId: number;
  trigger?: React.ReactNode;
}

export function CardCreateModal({ deckId, trigger }: CardCreateModalProps) {
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim()) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await createCard({
          deckId,
          front: front.trim(),
          back: back.trim(),
        });

        if (result.success) {
          setFront("");
          setBack("");
          setOpen(false);
          router.refresh();
        } else {
          console.error("Failed to create card:", result.error);
          // TODO: Add proper error handling/toast
        }
      } catch (error) {
        console.error("Error creating card:", error);
      }
    });
  };

  const resetForm = () => {
    setFront("");
    setBack("");
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
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Card</DialogTitle>
            <DialogDescription>
              Add a new flashcard to your deck. Enter the question or term on the front 
              and the answer or definition on the back.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="front">Front of Card</Label>
              <Textarea
                id="front"
                placeholder="Enter the question, term, or concept..."
                value={front}
                onChange={(e) => setFront(e.target.value)}
                className="resize-none"
                rows={3}
                disabled={isPending}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="back">Back of Card</Label>
              <Textarea
                id="back"
                placeholder="Enter the answer, definition, or explanation..."
                value={back}
                onChange={(e) => setBack(e.target.value)}
                className="resize-none"
                rows={3}
                disabled={isPending}
                required
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
              disabled={isPending || !front.trim() || !back.trim()}
            >
              {isPending ? "Creating..." : "Create Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
