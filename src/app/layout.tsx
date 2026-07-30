import type { Metadata } from "next";
import { Poppins, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/theme-provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AgriVerse Academy | India's Largest ICAR Learning Platform",
  description:
    "AgriVerse Academy is India's premier educational platform for ICAR students. Access study materials, books, notes, previous year questions, mock tests, video lectures for Agriculture, Horticulture, Forestry, Biotechnology and all ICAR disciplines.",
  keywords: [
    "ICAR",
    "Agriculture Education",
    "ICAR JRF",
    "ICAR SRF",
    "Agriculture Notes",
    "ICAR Books",
    "Mock Tests",
    "Previous Year Questions",
    "Horticulture",
    "Biotechnology",
    "AgriVerse",
    "ICAR Preparation",
    "AIEEA",
    "CSIR NET",
    "GATE Agriculture",
  ],
  authors: [{ name: "AgriVerse Academy" }],
  icons: {
    icon: "/images/logo.png",
    appleTouchIcon: "/images/logo.png",
  },
  openGraph: {
    title: "AgriVerse Academy | India's Largest ICAR Learning Platform",
    description:
      "Access premium study materials, books, notes, PYQs, mock tests for all ICAR disciplines. Join 100,000+ students preparing for ICAR exams.",
    url: "https://agriverse.academy",
    siteName: "AgriVerse Academy",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgriVerse Academy | India's Largest ICAR Learning Platform",
    description:
      "Premium ICAR education platform with study materials, mock tests, video lectures.",
    images: ["/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} ${plusJakarta.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
