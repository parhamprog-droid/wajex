"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import TabBar, { type TabId } from "@/components/TabBar";
import TranslatorCard, {
  type TranslatorCardHandle,
} from "@/components/TranslatorCard";
import FeaturePanel from "@/components/FeaturePanel";
import type { TranslationItem } from "@/lib/db";
import type { Tone } from "@/lib/tone";

export default function Home() {
  const [prefill, setPrefill] = useState<TranslationItem | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("text");
  const [tone, setTone] = useState<Tone>("formal");
  const cardRef = useRef<TranslatorCardHandle>(null);

  const [translationData, setTranslationData] = useState({
    input: "",
    output: "",
    sourceLang: "fa",
    targetLang: "en",
    timeMs: 0,
  });

  return (
    <main className="min-h-screen pb-20">
      <Header onSelectHistory={(item) => setPrefill(item)} />
      <div className="px-6 mt-4">
        <TranslatorCard
          ref={cardRef}
          prefill={prefill}
          activeTab={activeTab}
          tone={tone}
          onToneChange={setTone}
          onTranslationComplete={(
            input,
            output,
            sourceLang,
            targetLang,
            timeMs
          ) => {
            setTranslationData({
              input,
              output,
              sourceLang,
              targetLang,
              timeMs,
            });
          }}
        />
        <TabBar active={activeTab} onChange={setActiveTab} />
        <FeaturePanel
          tone={tone}
          onToneChange={setTone}
          input={translationData.input}
          output={translationData.output}
          sourceLang={translationData.sourceLang}
          targetLang={translationData.targetLang}
          translationTimeMs={translationData.timeMs}
        />
      </div>
    </main>
  );
}