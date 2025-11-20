"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UXAnalysisFormProps {
  onSubmit: (url: string) => Promise<void>;
  loading?: boolean;
  className?: string;
}

export function UXAnalysisForm({ onSubmit, loading = false, className }: UXAnalysisFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!url.trim()) {
      return;
    }

    await onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 w-full ${className}`}>
      <label htmlFor="url" className="text-sm font-medium text-foreground">
        <h2 className="text-xl text-foreground font-bold mb-0">Get a free website analysis</h2>
          <p className="text-sm text-muted-foreground">Enter your website or landing page below</p>
      </label>
      <Input
        id="url"
        placeholder="Website or landing page URL"
        className="w-full h-12"
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
        required
      />
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="px-8 sm:w-auto"
        disabled={loading}
      >
        {loading ? "Analysing..." : "Get a website analysis!"}
      </Button>
    </form>
  );
}

