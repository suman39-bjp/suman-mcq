// ✅ Run on Vercel Edge Network (Cloudflare IPs) — far less blocked by Instagram
export const runtime = "edge";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function extractVideoUrl(html: string): string | null {
  const patterns = [
    /"video_url"\s*:\s*"([^"]+)"/,
    /playable_url[\\"]?\s*:\s*[\\"]([^"\\]{20,})/,
    /<meta[^>]+property="og:video:secure_url"[^>]+content="([^"]+)"/,
    /<meta[^>]+content="([^"]+)"[^>]+property="og:video:secure_url"/,
    /<meta[^>]+property="og:video"[^>]+content="([^"]+)"/,
    /<meta[^>]+content="([^"]+)"[^>]+property="og:video"/,
    /"contentUrl"\s*:\s*"([^"]+)"/,
    /<video[^>]+src="(https:\/\/[^"]+\.mp4[^"]*)"/i,
  ];
  for (const p of patterns) {
    const m = html.match(p);
    if (m?.[1] && m[1].includes("http")) {
      return m[1].replace(/\\u0026/g, "&").replace(/&amp;/g, "&").replace(/\\\//g, "/");
    }
  }
  return null;
}

// ─── Strategy 1: Embed page (Edge IPs — most likely to work) ─────────────────
async function tryEmbedPage(shortcode: string): Promise<string | null> {
  const urls = [
    `https://www.instagram.com/reel/${shortcode}/embed/captioned/`,
    `https://www.instagram.com/p/${shortcode}/embed/captioned/`,
    `https://www.instagram.com/reel/${shortcode}/embed/`,
  ];
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  ];
  for (const url of urls) {
    for (const ua of userAgents) {
      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": ua,
            Accept: "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.9",
            Referer: "https://www.instagram.com/",
          },
        });
        if (!res.ok) continue;
        const html = await res.text();
        const found = extractVideoUrl(html);
        if (found) return found;
      } catch { continue; }
    }
  }
  return null;
}

// ─── Strategy 2: Social-bot user agents on main URL ───────────────────────────
async function tryBotScrape(postUrl: string): Promise<string | null> {
  const agents = [
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "facebookexternalhit/1.1",
    "Facebot Twitterbot/1.0",
    "WhatsApp/2.24.8.85 A",
    "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
    "TelegramBot (like TwitterBot)",
    "LinkedInBot/1.0",
  ];
  for (const ua of agents) {
    try {
      const res = await fetch(postUrl, {
        headers: { "User-Agent": ua, Accept: "text/html", "Accept-Language": "en-US,en;q=0.5" },
      });
      if (!res.ok) continue;
      const html = await res.text();
      const found = extractVideoUrl(html);
      if (found) return found;
    } catch { continue; }
  }
  return null;
}

// ─── Strategy 3: AllOrigins proxy ────────────────────────────────────────────
async function tryAllOrigins(postUrl: string): Promise<string | null> {
  try {
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(postUrl)}`;
    const res = await fetch(proxy);
    if (!res.ok) return null;
    const data = await res.json() as { contents?: string };
    if (!data?.contents) return null;
    return extractVideoUrl(data.contents);
  } catch { return null; }
}

// ─── Strategy 4: RapidAPI (if key is set) ─────────────────────────────────────
async function tryRapidApi(postUrl: string, key: string) {
  try {
    const res = await fetch(
      `https://social-media-video-downloader.p.rapidapi.com/smvd/get/instagram?url=${encodeURIComponent(postUrl)}`,
      {
        headers: {
          "X-RapidAPI-Key": key,
          "X-RapidAPI-Host": "social-media-video-downloader.p.rapidapi.com",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json() as {
      links?: { quality: string; link: string }[];
      src?: string;
      title?: string;
      thumbnail?: string;
    };
    const videoUrl =
      data?.links?.find((l) => l.quality?.toLowerCase().includes("hd"))?.link ??
      data?.links?.[0]?.link ??
      data?.src ??
      null;
    return videoUrl
      ? { videoUrl, title: data.title ?? "", thumbnail: data.thumbnail ?? "" }
      : null;
  } catch { return null; }
}

// ─── Strategy 5: Apify (if token is set) ─────────────────────────────────────
async function tryApify(postUrl: string, token: string): Promise<string | null> {
  try {
    // Run the actor synchronously (waits for result)
    const runRes = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?token=${token}&timeout=25`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directUrls: [postUrl], resultsType: "posts", resultsLimit: 1 }),
      }
    );
    if (!runRes.ok) return null;
    const items = await runRes.json() as Array<{ videoUrl?: string }>;
    return items?.[0]?.videoUrl ?? null;
  } catch { return null; }
}

// ─── oEmbed: metadata only ────────────────────────────────────────────────────
async function fetchOEmbed(postUrl: string) {
  try {
    const res = await fetch(
      `https://www.instagram.com/api/oembed/?url=${encodeURIComponent(postUrl)}&omitscript=true`,
      { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } }
    );
    if (!res.ok) return null;
    return res.json() as Promise<{ title?: string; thumbnail_url?: string; author_name?: string }>;
  } catch { return null; }
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { url } = await req.json() as { url?: string };
    if (!url || typeof url !== "string") {
      return Response.json({ error: "Please provide an Instagram Reel URL." }, { status: 400 });
    }

    const parsed = parseUrl(url);
    if (!parsed) {
      return Response.json(
        { error: "Invalid URL. Paste a link like https://www.instagram.com/reel/..." },
        { status: 400 }
      );
    }

    const { shortcode, postUrl } = parsed;
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const apifyToken = process.env.APIFY_TOKEN;

    let videoUrl: string | null = null;
    let title = "Instagram Reel";
    let thumbnail = "";
    let authorName = "";

    // Priority order: paid APIs first (most reliable), then free scraping
    if (rapidApiKey) {
      const r = await tryRapidApi(postUrl, rapidApiKey);
      if (r) { videoUrl = r.videoUrl; if (r.title) title = r.title; thumbnail = r.thumbnail; }
    }

    if (!videoUrl && apifyToken) {
      videoUrl = await tryApify(postUrl, apifyToken);
    }

    // Free methods (run always, in parallel for speed)
    if (!videoUrl) {
      const [embed, bot, proxy] = await Promise.allSettled([
        tryEmbedPage(shortcode),
        tryBotScrape(postUrl),
        tryAllOrigins(postUrl),
      ]);
      videoUrl =
        (embed.status === "fulfilled" ? embed.value : null) ??
        (bot.status === "fulfilled" ? bot.value : null) ??
        (proxy.status === "fulfilled" ? proxy.value : null) ??
        null;
    }

    // oEmbed for metadata (always try, independent)
    const oembed = await fetchOEmbed(postUrl);
    if (oembed) {
      if (!title || title === "Instagram Reel") title = oembed.title ?? title;
      if (!thumbnail) thumbnail = oembed.thumbnail_url ?? "";
      authorName = oembed.author_name ?? "";
    }

    return Response.json({ success: true, postUrl, videoUrl, thumbnail, title, authorName });
  } catch (err) {
    console.error("[instagram/download]", err);
    return Response.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
