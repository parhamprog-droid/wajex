import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wajex — مترجم هوشمند",
  description: "پلتفرم ترجمه مدرن با ویژگی‌های پیشرفته",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wajex",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#6C5CE7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('wajex-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = saved ? saved === 'dark' : prefersDark;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  }
                  
                  // بارگذاری تنظیمات
                  var settings = localStorage.getItem('wajex-settings');
                  if (settings) {
                    var s = JSON.parse(settings);
                    // اعمال تم
                    if (s.theme === 'auto') {
                      document.documentElement.classList.toggle('dark', prefersDark);
                    } else if (s.theme) {
                      document.documentElement.classList.toggle('dark', s.theme === 'dark');
                    }
                    // اعمال اندازه فونت
                    if (s.fontSize) {
                      document.documentElement.classList.add('font-' + s.fontSize);
                    }
                    // اعمال شفافیت
                    if (s.glassOpacity) {
                      document.documentElement.style.setProperty('--glass-opacity', s.glassOpacity);
                    }
                  } else {
                    document.documentElement.classList.add('font-medium');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}