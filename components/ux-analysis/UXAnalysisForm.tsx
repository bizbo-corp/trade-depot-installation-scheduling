"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UXAnalysisFormProps {
  onSubmit: (url: string) => Promise<void>;
  loading?: boolean;
}

export function UXAnalysisForm({ onSubmit, loading = false }: UXAnalysisFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!url.trim()) {
      return;
    }

    await onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <label htmlFor="url" className="text-sm font-medium text-foreground">
        URL
      </label>
      <Input
        id="url"
        placeholder="Enter your URL"
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

