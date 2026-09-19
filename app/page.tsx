"use client";

import { useState } from "react";
import Header from "@/components/Header";
import TranslatorCard from "@/components/TranslatorCard";
import TabBar from "@/components/TabBar";
import FeaturePanel from "@/components/FeaturePanel";
import type { TranslationItem } from "@/lib/db";

export default function Home() {
  const [prefill, setPrefill] = useState<TranslationItem | null>(null);

  return (
    <main className="min-h-screen pb-20">
      <Header onSelectHistory={(item) => setPrefill(item)} />
      <div className="px-6 mt-4">
        <TranslatorCard prefill={prefill} />
        <TabBar />
        <FeaturePanel />
      </div>
    </main>
  );
}