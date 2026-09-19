"use client";

import { useState, useRef } from "react";
import Header from "@/components/Header";
import TabBar, { type TabId } from "@/components/TabBar";
import TranslatorCard, {
  type TranslatorCardHandle,
} from "@/components/TranslatorCard";
import FeaturePanel from "@/components/FeaturePanel";
import DownloadModal from "@/components/DownloadModal";
import DesktopBanner from "@/components/DesktopBanner";
import ScrollProgress from "@/components/ScrollProgress";
import ParticlesBackground from "@/components/ParticlesBackground";
import ScrollReveal from "@/components/ScrollReveal";
import type { TranslationItem } from "@/lib/db";
import type { Tone } from "@/lib/tone";

export default function Home() {
  const [prefill, setPrefill] = useState<TranslationItem | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("text");
  const [tone, setTone] = useState<Tone>("formal");
  const [downloadOpen, setDownloadOpen] = useState(false);
  const cardRef = useRef<TranslatorCardHandle>(null);

  const [translationData, setTranslationData] = useState({
    input: "",
    output: "",
    sourceLang: "fa",
    targetLang: "en",
    timeMs: 0,
  });

  return (
    <>
      {/* نوار پیشرفت اسکرول */}
      <ScrollProgress />

      {/* پس‌زمینه ذرات */}
      <ParticlesBackground />

      <main className="relative min-h-screen pb-20 content-wrapper">
        {/* هدر */}
        <Header onSelectHistory={(item) => setPrefill(item)} />

        {/* بنر نسخه دسکتاپ */}
        <ScrollReveal direction="down" delay={0.1}>
          <DesktopBanner onDownload={() => setDownloadOpen(true)} />
        </ScrollReveal>

        <div className="px-6 mt-4">
          {/* کارت ترجمه */}
          <div className="translator-card">
            <ScrollReveal direction="up" delay={0.2}>
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
            </ScrollReveal>
          </div>

          {/* تب‌بار */}
          <ScrollReveal direction="up" delay={0.3}>
            <TabBar active={activeTab} onChange={setActiveTab} />
          </ScrollReveal>

          {/* پنل ویژگی */}
          <ScrollReveal direction="up" delay={0.4}>
            <FeaturePanel
              tone={tone}
              onToneChange={setTone}
              input={translationData.input}
              output={translationData.output}
              sourceLang={translationData.sourceLang}
              targetLang={translationData.targetLang}
              translationTimeMs={translationData.timeMs}
            />
          </ScrollReveal>
        </div>

        <DownloadModal
          open={downloadOpen}
          onClose={() => setDownloadOpen(false)}
        />
      </main>
    </>
  );
}