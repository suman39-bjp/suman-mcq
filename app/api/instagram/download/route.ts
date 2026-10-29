import { NextRequest, NextResponse } from "next/server";

function normaliseUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (!url.hostname.includes("instagram.com")) return null;
    const match = url.pathname.match(/\/(reel|p|tv)\/([A-Za-z0-9_-]+)/);
    if (!match) return null;
    return `https://www.instagram.com/reel/${match[2]}/`;
  } catch {
    return null;
  }
}

async function fetchOEmbed(postUrl: string) {
  const endpoint = `https://www.instagram.com/api/oembed/?url=${encodeURIComponent(postUrl)}&omitscript=true`;
  const res = await fetch(endpoint, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`oEmbed: ${res.status}`);
  return res.json();
}

async function scrapeVideoUrl(postUrl: string): Promise<string | null> {
  const res = await fetch(postUrl, {
    headers: {
      "User-Agent":
        "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const html = await res.text();

  const ogVideo = html.match(/<meta[^>]+property="og:video"[^>]+content="([^"]+)"/);
  if (ogVideo?.[1]) return ogVideo[1];

  const ogSecure = html.match(/<meta[^>]+property="og:video:secure_url"[^>]+content="([^"]+)"/);
  if (ogSecure?.[1]) return ogSecure[1];

  const ldMatch = html.match(/"contentUrl"\s*:\s*"([^"]+)"/);
  if (ldMatch?.[1]) return ldMatch[1].replace(/\\u0026/g, "&");

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Please provide an Instagram Reel URL." }, { status: 400 });
    }

    const normUrl = normaliseUrl(url);
    if (!normUrl) {
      return NextResponse.json(
        { error: "Invalid URL. Paste a link like https://www.instagram.com/reel/..." },
        { status: 400 }
      );
    }

    let title = "Instagram Reel";
    let thumbnail = "";
    let authorName = "";

    try {
      const oembed = await fetchOEmbed(normUrl);
      title = oembed.title || title;
      thumbnail = oembed.thumbnail_url || "";
      authorName = oembed.author_name || "";
    } catch {
      // continue without metadata
    }

    const videoUrl = await scrapeVideoUrl(normUrl);

    return NextResponse.json({ success: true, postUrl: normUrl, videoUrl, thumbnail, title, authorName });
  } catch (err) {
    console.error("[instagram/download]", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
