"use client";

import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";
import { useGetTerms, useUpdateTerms } from "@/hooks/api/website/useTerms";

export function TermsAndConditionsTab() {
  const { data: terms, isLoading } = useGetTerms();
  const updateTerms = useUpdateTerms();
  const [content, setContent] = useState("");

  // Populate editor when data loads
  useEffect(() => {
    if (terms?.content) {
      setContent(terms.content);
    }
  }, [terms?.content]);

  const handleSave = () => {
    updateTerms.mutate(content);
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center text-sm text-[#64748B]">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <RichTextEditor
        value={content}
        onChange={setContent}
        className="min-h-[400px]"
        placeholder="Enter terms and conditions..."
      />
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateTerms.isPending}
          className={cn(
            BUTTON_STYLES.primary.md,
            "font-inter text-[14px] font-semibold",
          )}
        >
          {updateTerms.isPending ? "Saving..." : "Save Terms & Conditions"}
        </Button>
      </div>
    </div>
  );
}
