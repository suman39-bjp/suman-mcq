"use client";

import { useState, useRef, useCallback } from "react";

interface ReelResult {
  success: boolean;
  postUrl: string;
  videoUrl: string | null;
  thumbnail: string;
  title: string;
  authorName: string;
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

const HOW_TO = [
  { num: "1", title: "Copy the Reel URL", desc: 'Open Instagram, tap ··· on any Reel and choose "Copy Link".' },
  { num: "2", title: "Paste & Click Download", desc: "Paste the URL into the box above and hit the Download button." },
  { num: "3", title: "Save the Video", desc: 'Click "Save Video" to download the reel to your device.' },
];

const FEATURES = [
  { icon: "⚡", title: "Lightning Fast", desc: "Results in seconds" },
  { icon: "🆓", title: "100% Free", desc: "No hidden charges" },
  { icon: "🔒", title: "Privacy First", desc: "We store nothing" },
  { icon: "📱", title: "Mobile Friendly", desc: "Works on any device" },
  { icon: "🎬", title: "HD Quality", desc: "Best resolution available" },
  { icon: "🚫", title: "No Watermark", desc: "Clean downloads" },
];

const FAQS = [
  { q: "Is this tool free?", a: "Yes, completely free. No signup, no hidden charges, no watermarks." },
  { q: "Do I need to log in to Instagram?", a: "No login required. Works with any public Instagram Reel URL." },
  { q: "What video quality will I get?", a: "We always try to fetch the highest quality (HD) version available." },
  { q: "Why can't I download private reels?", a: "Private accounts restrict access. Only public reels can be downloaded." },
  { q: "Is it safe to use?", a: "Absolutely. We never store your URLs or any personal data." },
];

export default function ReelDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReelResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setUrl("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text.trim());
    } catch {
      inputRef.current?.focus();
    }
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!url.trim()) return;
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const res = await fetch("/api/instagram/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || "Something went wrong. Please try again.");
        } else {
          setResult(data);
        }
      } catch {
        setError("Network error. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <a href="https://aotech.shop" className="text-xl font-bold ig-gradient-text">AoTech</a>
        <span className="text-sm text-gray-500">Free Tools</span>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden py-14 px-4 text-center">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(220,39,67,0.18) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 flex flex-col items-center gap-5 max-w-2xl mx-auto">
          <div className="ig-gradient p-4 rounded-2xl shadow-2xl animate-pulse-ring">
            <InstagramIcon />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Instagram Reel <span className="ig-gradient-text">Downloader</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg">
            Download any public Instagram Reel instantly — free, HD, no watermark, no login.
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pb-16">

        {/* Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl">
          {!result ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label htmlFor="reel-url" className="text-sm font-medium text-gray-300">
                Instagram Reel URL
              </label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-pink-500/60 transition-colors">
                <input
                  ref={inputRef}
                  id="reel-url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/..."
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                />
                {url ? (
                  <button type="button" onClick={() => setUrl("")} className="text-gray-500 hover:text-gray-300 transition text-lg leading-none" aria-label="Clear">
                    ✕
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-pink-400 transition border border-white/10 rounded-lg px-2 py-1"
                  >
                    📋 Paste
                  </button>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <span className="shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!url.trim() || loading}
                className="ig-gradient flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white shadow-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full inline-block animate-spin" aria-hidden />
                    Fetching Reel…
                  </>
                ) : (
                  <><DownloadIcon /> Download Reel</>
                )}
              </button>
              <p className="text-center text-xs text-gray-600">Only public Instagram Reels can be downloaded.</p>
            </form>
          ) : (
            <div className="flex flex-col gap-5">
              {result.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <div className="relative w-full max-w-xs mx-auto rounded-xl overflow-hidden border border-white/10 aspect-square">
                  <img src={result.thumbnail} alt={result.title || "Reel thumbnail"} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="text-center">
                {result.authorName && <p className="text-sm text-pink-400 font-medium mb-1">@{result.authorName}</p>}
                {result.title && <p className="text-gray-300 text-sm line-clamp-3">{result.title}</p>}
              </div>

              {result.videoUrl ? (
                <a
                  href={result.videoUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-gradient flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white shadow-lg hover:opacity-90 transition"
                >
                  <DownloadIcon /> Save Video (HD)
                </a>
              ) : (
                <>
                  <div className="text-center text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3">
                    <p className="font-medium mb-1">Direct download unavailable</p>
                    <p className="text-xs text-gray-400">Instagram restricts direct downloads for this reel. Open it on Instagram to save manually.</p>
                  </div>
                  <a
                    href={result.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold border border-white/10 hover:bg-white/5 transition"
                  >
                    ↗ Open on Instagram
                  </a>
                </>
              )}
              <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-300 transition underline underline-offset-4 mx-auto">
                ← Download another reel
              </button>
            </div>
          )}
        </div>

        {/* How it works */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">How to Download</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {HOW_TO.map((step) => (
              <div key={step.num} className="glass-card rounded-xl p-5 text-center">
                <div className="ig-gradient w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 shadow">
                  {step.num}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-center mb-8">Why AoTech?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass-card rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">{f.icon}</div>
                <p className="font-semibold text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-center mb-8">FAQ</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="font-medium text-sm">{faq.q}</span>
                  <span className="text-gray-500 text-lg">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && <div className="px-5 pb-4 text-sm text-gray-400">{faq.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* SEO text */}
        <section className="mt-14 text-center max-w-xl mx-auto">
          <h2 className="text-xl font-bold mb-3">The Easiest Instagram Reel Downloader</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            AoTech&apos;s Instagram Reel Downloader lets you save any public Instagram Reel to your phone or computer in seconds.
            No app installation, no account required. Simply paste the reel URL and download in HD quality for free.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-sm text-gray-600">
        <p className="mb-2">
          <a href="https://aotech.shop" className="hover:text-gray-400 transition">AoTech</a> — Free online tools
        </p>
        <p className="text-xs text-gray-700">
          For personal use only. Please respect Instagram&apos;s{" "}
          <a href="https://help.instagram.com/581066165581870" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-500">
            Terms of Service
          </a>.
        </p>
      </footer>
    </div>
  );
}
