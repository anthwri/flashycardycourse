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
import { updateCard } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Card {
  id: number;
  front: string;
  back: string;
}

interface CardEditModalProps {
  card: Card;
  trigger?: React.ReactNode;
}

export function CardEditModal({ card, trigger }: CardEditModalProps) {
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Reset form when card changes or modal opens
  useEffect(() => {
    if (open) {
      setFront(card.front);
      setBack(card.back);
    }
  }, [open, card.front, card.back]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim()) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateCard({
          id: card.id,
          front: front.trim(),
          back: back.trim(),
        });

        if (result.success) {
          setOpen(false);
          router.refresh();
        } else {
          console.error("Failed to update card:", result.error);
          // TODO: Add proper error handling/toast
        }
      } catch (error) {
        console.error("Error updating card:", error);
      }
    });
  };

  const resetForm = () => {
    setFront(card.front);
    setBack(card.back);
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
          <Button variant="ghost" size="sm">
            <Edit className="w-3 h-3" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
            <DialogDescription>
              Update the content of your flashcard. Make sure both sides have clear, 
              helpful information for your study session.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-front">Front of Card</Label>
              <Textarea
                id="edit-front"
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
              <Label htmlFor="edit-back">Back of Card</Label>
              <Textarea
                id="edit-back"
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
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
