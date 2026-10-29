import { NextRequest, NextResponse } from "next/server";

// Allow up to 60 seconds on Vercel Serverless
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const APIFY_TOKEN = process.env.APIFY_TOKEN;

function cleanInstagramUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (!url.hostname.includes("instagram.com")) return null;
    const match = url.pathname.match(/\/(reel|p|tv|reels)\/([A-Za-z0-9_-]+)/);
    if (!match) return null;
    return `https://www.instagram.com/reel/${match[2]}/`;
  } catch {
    return null;
  }
}

// Fallback: oEmbed for metadata if needed
async function fetchOEmbed(postUrl: string) {
  try {
    const res = await fetch(
      `https://www.instagram.com/api/oembed/?url=${encodeURIComponent(postUrl)}&omitscript=true`,
      { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Please paste an Instagram Reel URL." },
        { status: 400 }
      );
    }

    const cleanUrl = cleanInstagramUrl(url);
    if (!cleanUrl) {
      return NextResponse.json(
        { error: "Invalid Instagram link. Please paste a valid Reel URL." },
        { status: 400 }
      );
    }

    // Start Apify Actor run
    const runRes = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-scraper/runs?token=${APIFY_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          directUrls: [cleanUrl],
          resultsType: "posts",
          resultsLimit: 1,
          addParentData: false,
        }),
      }
    );

    if (!runRes.ok) {
      const errText = await runRes.text();
      console.error("Apify start error:", errText);
      return NextResponse.json(
        { error: "Failed to connect to extraction server. Please try again." },
        { status: 502 }
      );
    }

    const runData = await runRes.json();
    const runId = runData.data?.id;
    const datasetId = runData.data?.defaultDatasetId;

    if (!runId || !datasetId) {
      return NextResponse.json(
        { error: "Could not initialize extraction task." },
        { status: 500 }
      );
    }

    // Poll for completion (up to ~45 seconds)
    const startTime = Date.now();
    let status = runData.data?.status;

    while (
      status !== "SUCCEEDED" &&
      status !== "FAILED" &&
      status !== "TIMED-OUT" &&
      status !== "ABORTED"
    ) {
      if (Date.now() - startTime > 48000) {
        break; // Approaching limit
      }
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const checkRes = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
      );
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        status = checkData.data?.status;
      }
    }

    if (status === "SUCCEEDED") {
      const itemsRes = await fetch(
        `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`
      );
      if (itemsRes.ok) {
        const items = (await itemsRes.json()) as Array<{
          videoUrl?: string;
          displayUrl?: string;
          caption?: string;
          ownerUsername?: string;
          error?: string;
        }>;

        const firstItem = items[0];

        if (firstItem && firstItem.videoUrl) {
          return NextResponse.json({
            success: true,
            postUrl: cleanUrl,
            videoUrl: firstItem.videoUrl,
            thumbnail: firstItem.displayUrl || "",
            title: firstItem.caption || "Instagram Reel",
            authorName: firstItem.ownerUsername || "",
          });
        }

        if (firstItem && firstItem.error === "not_found") {
          return NextResponse.json(
            { error: "This reel was not found or the account is private." },
            { status: 404 }
          );
        }
      }
    }

    // Fallback: Check oEmbed for at least post metadata
    const oembed = await fetchOEmbed(cleanUrl);
    return NextResponse.json({
      success: true,
      postUrl: cleanUrl,
      videoUrl: null,
      thumbnail: oembed?.thumbnail_url || "",
      title: oembed?.title || "Instagram Reel",
      authorName: oembed?.author_name || "",
    });
  } catch (err: unknown) {
    console.error("[instagram/download]", err);
    return NextResponse.json(
      { error: "Server error while processing reel. Please try again." },
      { status: 500 }
    );
  }
}
