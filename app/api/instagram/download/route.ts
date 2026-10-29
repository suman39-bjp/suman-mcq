import { NextRequest, NextResponse } from "next/server";

function parseUrl(raw: string): { shortcode: string; postUrl: string } | null {
  try {
    const url = new URL(raw.trim());
    if (!url.hostname.includes("instagram.com")) return null;
    const match = url.pathname.match(/\/(reel|p|tv|reels)\/([A-Za-z0-9_-]+)/);
    if (!match) return null;
    return {
      shortcode: match[2],
      postUrl: `https://www.instagram.com/reel/${match[2]}/`,
    };
  } catch {
    return null;
  }
}

// ── Strategy 1: Instagram Embed page (semi-official, low blocking) ─────────────
async function tryEmbedPage(shortcode: string): Promise<string | null> {
  const urls = [
    `https://www.instagram.com/reel/${shortcode}/embed/captioned/`,
    `https://www.instagram.com/p/${shortcode}/embed/captioned/`,
    `https://www.instagram.com/reel/${shortcode}/embed/`,
  ];

  const patterns = [
    /"video_url"\s*:\s*"([^"]+)"/,
    /playable_url[\\"]?\s*:\s*[\\"]([^"\\]+)/,
    /"src"\s*:\s*"(https:\/\/[^"]+\.mp4[^"]*)"/,
    /video[^"]*src[^"]*:\s*"(https:\/\/[^"]+)"/i,
    /<video[^>]+src="([^"]+)"/i,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://www.instagram.com/",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "same-origin",
        },
        cache: "no-store",
      });
      if (!res.ok) continue;
      const html = await res.text();

      for (const pattern of patterns) {
        const m = html.match(pattern);
        if (m?.[1]) {
          return m[1]
            .replace(/\\u0026/g, "&")
            .replace(/&amp;/g, "&")
            .replace(/\\\//g, "/");
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

// ── Strategy 2: og:video from multiple user-agents ────────────────────────────
async function tryOgVideo(postUrl: string): Promise<string | null> {
  const agents = [
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "Facebot Twitterbot/1.0",
    "WhatsApp/2.24.8.85 A",
    "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
    "LinkedInBot/1.0 (compatible; Mozilla/5.0; Jakarta Commons-HttpClient/3.1 +http://www.linkedin.com)",
    "TelegramBot (like TwitterBot)",
  ];

  const patterns = [
    /<meta[^>]+property="og:video:secure_url"[^>]+content="([^"]+)"/,
    /<meta[^>]+content="([^"]+)"[^>]+property="og:video:secure_url"/,
    /<meta[^>]+property="og:video"[^>]+content="([^"]+)"/,
    /<meta[^>]+content="([^"]+)"[^>]+property="og:video"/,
    /"contentUrl"\s*:\s*"([^"]+)"/,
    /"video_url"\s*:\s*"([^"]+)"/,
  ];

  for (const ua of agents) {
    try {
      const res = await fetch(postUrl, {
        headers: {
          "User-Agent": ua,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
        cache: "no-store",
      });
      if (!res.ok) continue;
      const html = await res.text();

      for (const pattern of patterns) {
        const m = html.match(pattern);
        if (m?.[1]) {
          return m[1].replace(/\\u0026/g, "&").replace(/&amp;/g, "&");
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

// ── Strategy 3: RapidAPI (primary, if key set) ────────────────────────────────
async function tryRapidApi(postUrl: string, key: string) {
  // Try Social Media Video Downloader first
  try {
    const res = await fetch(
      `https://social-media-video-downloader.p.rapidapi.com/smvd/get/instagram?url=${encodeURIComponent(postUrl)}`,
      {
        headers: {
          "X-RapidAPI-Key": key,
          "X-RapidAPI-Host": "social-media-video-downloader.p.rapidapi.com",
        },
        cache: "no-store",
      }
    );
    if (res.ok) {
      const data = await res.json();
      const videoUrl =
        data?.links?.find((l: { quality: string; link: string }) => l.quality?.includes("hd"))?.link ??
        data?.links?.[0]?.link ??
        data?.src ??
        null;
      if (videoUrl) {
        return {
          videoUrl,
          title: data?.title ?? "",
          thumbnail: data?.thumbnail ?? "",
          authorName: "",
        };
      }
    }
  } catch { /* fall through */ }

  // Try instagram-downloader-without-watermark
  try {
    const res = await fetch(
      `https://instagram-downloader-without-watermark.p.rapidapi.com/index?url=${encodeURIComponent(postUrl)}`,
      {
        headers: {
          "X-RapidAPI-Key": key,
          "X-RapidAPI-Host": "instagram-downloader-without-watermark.p.rapidapi.com",
        },
        cache: "no-store",
      }
    );
    if (res.ok) {
      const data = await res.json();
      const videoUrl =
        data?.url?.find((u: { quality: string; url: string }) => u.quality?.includes("hd"))?.url ??
        data?.url?.[0]?.url ??
        null;
      if (videoUrl) {
        return { videoUrl, title: "", thumbnail: data?.thumbnail ?? "", authorName: "" };
      }
    }
  } catch { /* fall through */ }

  return null;
}

// ── Strategy 4: oEmbed for metadata ──────────────────────────────────────────
async function fetchOEmbed(postUrl: string) {
  try {
    const res = await fetch(
      `https://www.instagram.com/api/oembed/?url=${encodeURIComponent(postUrl)}&omitscript=true`,
      {
        headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Please provide an Instagram Reel URL." }, { status: 400 });
    }

    const parsed = parseUrl(url);
    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid URL. Paste a link like https://www.instagram.com/reel/..." },
        { status: 400 }
      );
    }

    const { shortcode, postUrl } = parsed;
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    let videoUrl: string | null = null;
    let title = "Instagram Reel";
    let thumbnail = "";
    let authorName = "";

    // 1. Try RapidAPI first if key is available (most reliable)
    if (rapidApiKey) {
      const r = await tryRapidApi(postUrl, rapidApiKey);
      if (r) {
        videoUrl = r.videoUrl;
        if (r.title) title = r.title;
        if (r.thumbnail) thumbnail = r.thumbnail;
      }
    }

    // 2. Try embed page scraping (works without API key on many reels)
    if (!videoUrl) {
      videoUrl = await tryEmbedPage(shortcode);
    }

    // 3. Try og:video social-bot scraping
    if (!videoUrl) {
      videoUrl = await tryOgVideo(postUrl);
    }

    // 4. Get metadata from oEmbed (independent of video extraction)
    const oembed = await fetchOEmbed(postUrl);
    if (oembed) {
      if (!title || title === "Instagram Reel") title = oembed.title ?? title;
      if (!thumbnail) thumbnail = oembed.thumbnail_url ?? "";
      authorName = oembed.author_name ?? "";
    }

    return NextResponse.json({
      success: true,
      postUrl,
      videoUrl,
      thumbnail,
      title,
      authorName,
    });
  } catch (err) {
    console.error("[instagram/download]", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
