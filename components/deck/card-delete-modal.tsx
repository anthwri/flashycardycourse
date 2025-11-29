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
import { Trash2 } from "lucide-react";
import { deleteCard } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface Card {
  id: number;
  front: string;
  back: string;
}

interface CardDeleteModalProps {
  card: Card;
  trigger?: React.ReactNode;
}

export function CardDeleteModal({ card, trigger }: CardDeleteModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteCard({
          id: card.id,
        });

        if (result.success) {
          setOpen(false);
          router.refresh();
        } else {
          console.error("Failed to delete card:", result.error);
          // TODO: Add proper error handling/toast
        }
      } catch (error) {
        console.error("Error deleting card:", error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Card</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this card? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-md">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Front
              </div>
              <p className="text-sm">{card.front}</p>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Back
              </div>
              <p className="text-sm">{card.back}</p>
            </div>
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
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete Card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
