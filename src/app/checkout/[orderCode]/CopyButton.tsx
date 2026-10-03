"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
      title="Copy"
    >
      {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
    </button>
  );
}
