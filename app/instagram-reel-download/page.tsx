import type { Metadata } from "next";
import ReelDownloader from "./ReelDownloader";

export const metadata: Metadata = {
  title: "Instagram Reel Downloader — Free HD Download | AoTech",
  description:
    "Download any Instagram Reel for free in HD quality. No login, no watermark. Paste the URL and save instantly.",
  keywords: [
    "instagram reel downloader",
    "download instagram reels",
    "instagram video download",
    "free reel downloader",
  ],
  alternates: {
    canonical: "https://aotech.shop/instagram-reel-download",
  },
  openGraph: {
    title: "Instagram Reel Downloader — AoTech",
    description: "Download Instagram Reels free & fast. No login needed.",
    url: "https://aotech.shop/instagram-reel-download",
    siteName: "AoTech",
    type: "website",
  },
};

export default function Page() {
  return <ReelDownloader />;
}
