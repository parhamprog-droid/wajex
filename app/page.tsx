import Header from "@/components/Header";
import TranslatorCard from "@/components/TranslatorCard";
import TabBar from "@/components/TabBar";
import FeaturePanel from "@/components/FeaturePanel";

export default function Home() {
  return (
    <main className="min-h-screen pb-20">
      <Header />
      <div className="px-6 mt-4">
        <TranslatorCard />
        <TabBar />
        <FeaturePanel />
      </div>
    </main>
  );
}