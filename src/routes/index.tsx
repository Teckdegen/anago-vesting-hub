import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "The Dog House — Every token needs a home" },
      {
        name: "description",
        content:
          "The Dog House on Monad: Vesting, Token Lock, DLMM and Yield Farm. Powered by ANAGO.",
      },
    ],
  }),
});

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4";
const ABOUT_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4";
const CTA_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4";

const DOG_IMG = "/feature-dog.png";

const FEATURES = [
  { title: "Vesting", score: "8.7/10" },
  { title: "Token Lock", score: "9/10" },
  { title: "DLMM", score: "8.9/10" },
  { title: "Yield Farm", score: "8.2/10" },
];

const NAV_LINKS = ["Home", "Vesting", "Token Lock", "DLMM", "Yield Farm"];

// X (Twitter) icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.844l-5.36-6.99L4.6 22H1.34l8.04-9.19L1 2h7.02l4.84 6.39L18.244 2Zm-1.2 18h1.9L7.04 4H5.04l12.004 16Z" />
    </svg>
  );
}

function Index() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="bg-background text-cream min-h-screen overflow-x-hidden">
      <div className="texture-overlay" aria-hidden="true" />

      {/* SECTION 1 — HERO */}
      <section className="relative w-full h-screen min-h-[700px] overflow-hidden rounded-b-[32px]">
        <img
          src="/hero.jpg"
          alt="The Dog House astronaut"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/30" />

        <div className="relative z-10 max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16 h-full flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between pt-8">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="The Dog House" className="w-10 h-10 rounded-md" />
              <span className="font-grotesk text-[16px] uppercase tracking-wider">
                The Dog House
              </span>
            </div>

            <nav className="hidden lg:block liquid-glass rounded-[28px] px-[52px] py-[24px]">
              <ul className="flex items-center gap-8">
                {NAV_LINKS.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="font-grotesk text-[13px] uppercase tracking-wider text-cream hover:text-neon transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href="#"
              className="liquid-glass rounded-[20px] px-6 py-3 font-grotesk text-[13px] uppercase tracking-wider text-cream hover:text-neon hover:-translate-y-0.5 transition-all duration-300"
            >
              Launch App
            </a>
          </header>

          {/* Hero content */}
          <div className="flex-1 flex items-center relative">
            <div className="relative max-w-[780px] lg:ml-32 fade-up">
              <span
                className="font-condiment text-neon block text-[32px] sm:text-[48px] md:text-[60px] lg:text-[72px] -rotate-[4deg] drop-shadow-[0_0_24px_rgba(111,255,0,0.55)] leading-none mb-4 lg:mb-6 ml-2"
              >
                The Dog House
              </span>
              <h1 className="font-grotesk uppercase text-cream text-[40px] sm:text-[60px] md:text-[75px] lg:text-[90px] leading-[1.05] sm:leading-[1] tracking-tight">
                Every token <br />
                needs a <span className="text-neon">(</span> home <span className="text-neon">)</span>
              </h1>
              <p className="mt-6 font-mono text-[12px] sm:text-[14px] uppercase text-cream/70 max-w-md tracking-wider">
                Vesting · Token Lock · DLMM · Yield Farm — on Monad. Powered by $ANAGO.
              </p>
              <div className="mt-8 flex items-center gap-3">
                <span className="inline-flex items-center gap-2 liquid-glass rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-cream/80">
                  <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                  Live on Monad
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — ABOUT */}
      <section className="relative w-full overflow-hidden">
        <img
          src="/about.jpg"
          alt="The Dog House astronauts"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/40" />

        <div className="relative z-10 max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div className="relative">
              <span
                className="font-condiment text-neon block text-[28px] sm:text-[40px] lg:text-[56px] -rotate-2 mb-3 drop-shadow-[0_0_24px_rgba(111,255,0,0.55)] leading-none"
              >
                Anago
              </span>
              <h2 className="font-grotesk uppercase text-cream text-[32px] sm:text-[44px] md:text-[52px] lg:text-[60px] leading-[1]">
                Hello! <br />
                We're The Dog House
              </h2>
            </div>

            <p className="font-mono text-[14px] sm:text-[16px] uppercase text-cream max-w-[266px]">
              A home for every token on Monad. Vesting, locks, dynamic liquidity & yield —
              one roof, no leaks.
            </p>
          </div>

          <div className="mt-16 flex justify-between gap-10">
            <div className="space-y-4 max-w-[266px]">
              <p className="font-mono text-[14px] uppercase opacity-10 text-cream">
                A home for every token on Monad. Vesting, locks, dynamic liquidity & yield —
                one roof, no leaks.
              </p>
              <p className="font-mono text-[14px] uppercase opacity-10 text-cream">
                Built for builders. Powered by $ANAGO. Secured by Monad.
              </p>
            </div>
            <div className="hidden lg:block space-y-4 max-w-[266px]">
              <p className="font-mono text-[14px] uppercase opacity-10 text-cream">
                A home for every token on Monad. Vesting, locks, dynamic liquidity & yield —
                one roof, no leaks.
              </p>
              <p className="font-mono text-[14px] uppercase opacity-10 text-cream">
                Built for builders. Powered by $ANAGO. Secured by Monad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FEATURES GRID */}
      <section className="relative w-full bg-background">
        <div className="max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-12">
            <h2 className="font-grotesk uppercase text-cream text-[32px] sm:text-[44px] md:text-[52px] lg:text-[60px] leading-[1]">
              A home for <br />
              <span className="inline-block ml-12 md:ml-24 lg:ml-32">
                <span className="font-condiment text-neon normal-case">every</span>{" "}
                token
              </span>
            </h2>

            <div className="text-right">
              <div className="flex items-end justify-end gap-3">
                <span className="font-grotesk uppercase text-cream text-[32px] sm:text-[48px] lg:text-[60px] leading-none">
                  Launch
                </span>
                <div className="flex flex-col font-grotesk uppercase text-cream text-[20px] sm:text-[28px] lg:text-[36px] leading-none">
                  <span>App</span>
                  <span>Now</span>
                </div>
              </div>
              <div className="bg-neon h-[6px] sm:h-[8px] lg:h-[10px] w-full mt-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <FeatureCard title={f.title} score={f.score} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3.5 — PROTOCOL STATS */}
      <section className="relative w-full bg-background border-t border-white/5">
        <div className="max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <h2 className="font-grotesk uppercase text-cream text-[32px] sm:text-[44px] md:text-[52px] lg:text-[60px] leading-[1]">
              Protocol <span className="font-condiment text-neon normal-case">stats</span>
            </h2>
            <p className="font-mono text-[12px] sm:text-[14px] uppercase text-cream/70 max-w-md">
              Live on Monad — total value processed across every Dog House product.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "Token Locks", value: "$0", sub: "Total locked" },
              { label: "Vesting", value: "$0", sub: "Under vesting" },
              { label: "DLMM", value: "$0", sub: "Liquidity processed" },
              { label: "Yield Farm", value: "$0", sub: "Staked TVL" },
            ].map((s) => (
              <div key={s.label} className="liquid-glass rounded-[24px] p-6 sm:p-8 hover:-translate-y-1 transition-transform duration-300">
                <div className="font-mono text-[11px] sm:text-[12px] uppercase text-cream/60 tracking-wider">
                  {s.label}
                </div>
                <div className="font-grotesk uppercase text-neon text-[32px] sm:text-[44px] lg:text-[56px] leading-none mt-3 drop-shadow-[0_0_18px_rgba(111,255,0,0.4)]">
                  {s.value}
                </div>
                <div className="font-mono text-[11px] uppercase text-cream/60 mt-2 tracking-wider">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — CTA */}
      <section className="relative w-full bg-background">
        <video
          src={CTA_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block"
        />

        <div className="absolute inset-0">
          <div className="max-w-[1831px] mx-auto h-full px-6 sm:px-10 lg:px-16 py-10 sm:py-16 lg:py-24 relative">
            <div className="lg:pr-[20%] lg:pl-[15%] text-right ml-auto relative inline-block float-right">
              <span
                className="font-condiment text-neon absolute -top-6 left-0 lg:-left-8 text-[17px] sm:text-[28px] md:text-[44px] lg:text-[68px] -rotate-2"
                style={{ mixBlendMode: "exclusion" }}
              >
                Go beyond
              </span>
              <h2 className="font-grotesk uppercase text-cream text-[16px] sm:text-[28px] md:text-[44px] lg:text-[60px] leading-[1]">
                <span className="block mb-4 sm:mb-8 lg:mb-12">Launch on Monad.</span>
                Lock with confidence. <br />
                Vest with control. <br />
                Farm the future.
              </h2>
              <a
                href="#"
                className="inline-block mt-8 liquid-glass rounded-[20px] px-8 py-4 font-grotesk uppercase text-[14px] tracking-wider text-cream hover:text-neon transition"
              >
                Launch App
              </a>
            </div>

            {/* Bottom-left socials: X + Telegram only */}
            <div className="absolute left-[5%] sm:left-[6%] lg:left-[8%] bottom-[10%] sm:bottom-[14%] lg:bottom-[18%]">
              <div className="liquid-glass rounded-[0.75rem] sm:rounded-[1rem] lg:rounded-[1.25rem] flex flex-col overflow-hidden">
                <a
                  href="#"
                  aria-label="X (Twitter)"
                  className="w-[14vw] sm:w-[10rem] lg:w-[14rem] h-[14vw] sm:h-[3.5rem] lg:h-[4.5rem] flex items-center justify-center text-cream hover:bg-white/10 transition border-b border-white/10"
                >
                  <XIcon className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  aria-label="Telegram"
                  className="w-[14vw] sm:w-[10rem] lg:w-[14rem] h-[14vw] sm:h-[3.5rem] lg:h-[4.5rem] flex items-center justify-center text-cream hover:bg-white/10 transition"
                >
                  <Send className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <footer className="relative z-10 max-w-[1831px] mx-auto px-6 sm:px-10 lg:px-16 py-8 flex items-center justify-between border-t border-white/10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="w-8 h-8 rounded-md" />
            <span className="font-grotesk uppercase text-[13px] tracking-wider">
              The Dog House · Powered by $ANAGO on Monad
            </span>
          </div>
          <span className="font-mono text-[11px] uppercase text-cream/60">
            © 2026 The Dog House
          </span>
        </footer>
      </section>
    </main>
  );
}

function FeatureCard({ title, score }: { title: string; score: string }) {
  return (
    <div className="liquid-glass rounded-[32px] p-[18px] hover:-translate-y-2 transition-all duration-500 group">
      <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden bg-gradient-to-br from-[#0b1440] via-[#1a0f3a] to-[#010828]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(111,255,0,0.12),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <img
          src={DOG_IMG}
          alt={title}
          className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute left-3 right-3 bottom-3">
          <div className="liquid-glass rounded-[20px] px-5 py-4 flex items-center justify-between">
            <div>
              <div className="font-grotesk uppercase text-cream text-[14px] tracking-wider">
                {title}
              </div>
              <div className="text-[11px] text-cream/60 uppercase mt-0.5 tracking-wider">Trust score</div>
              <div className="text-[16px] text-neon font-grotesk drop-shadow-[0_0_12px_rgba(111,255,0,0.4)]">{score}</div>
            </div>
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 group-hover:shadow-purple-500/80 transition-all duration-300"
              aria-label={`Open ${title}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                className="w-5 h-5 text-cream group-hover:translate-x-0.5 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
