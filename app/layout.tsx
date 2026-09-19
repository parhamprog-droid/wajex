import type { Metadata, Viewport } from "next";
import "./globals.css";
import ToastContainer from "@/components/ToastContainer";

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
  verification: {
    google: "tBt2J1aVIOW4t-hMkKsKbYTAXJFrDHBA3QduZJ7nRFw",
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
                  
                  var settings = localStorage.getItem('wajex-settings');
                  if (settings) {
                    var s = JSON.parse(settings);
                    if (s.theme === 'auto') {
                      document.documentElement.classList.toggle('dark', prefersDark);
                    } else if (s.theme) {
                      document.documentElement.classList.toggle('dark', s.theme === 'dark');
                    }
                    if (s.fontSize) {
                      document.documentElement.classList.add('font-' + s.fontSize);
                    }
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
      <body className="font-sans antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}