"use client";

import React, { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; description: string }) => void;
  title: string;
  isLoading?: boolean;
}

export function CreateTierModal({ isOpen, onClose, onSave, title, isLoading }: CreateTierModalProps) {
  const [formData, setFormData] = useState({ title: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);

    // Note: Don't clear here if we want to handle loading state, 
    // but usually success callback handles it.
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tier-title">Title</Label>
            <Input
              id="tier-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Semester 01, Week 01..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tier-desc">Description</Label>
            <Textarea
              id="tier-desc"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter a brief description..."
              className="resize-none h-24"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#E60076] hover:bg-[#C50065] text-white" disabled={isLoading}>
              {isLoading ? "Creating..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
