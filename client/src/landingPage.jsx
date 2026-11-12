
import React from "react";
import { Link } from "react-router-dom";
import botanicalArtwork from "./assets/art1.png";


function NuraLogo({ size = 42 }) {
  const id = React.useId().replace(/:/g, "");

  const colors = [
    "#E77D91", // Warm Pink
    "#EBC9A9", // Soft Peach
    "#A83D55", // Berry
    "#F6BFC1", // Dusty Rose
    "#E77D91", // Warm Pink
    "#EBC9A9", // Soft Peach
    "#A83D55", // Berry
    "#F6BFC1", // Dusty Rose
  ];

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        role="img"
        aria-label="Nura flower logo"
      >
        <defs>
          {colors.map((color, i) => {
            const angle = (i * 45 * Math.PI) / 180;

            // Calculate the outer tip of each rotated petal
            const tipX = 32 + 27 * Math.sin(angle);
            const tipY = 32 - 27 * Math.cos(angle);

            return (
              <linearGradient
                key={i}
                id={`${id}-petal-${i}`}
                gradientUnits="userSpaceOnUse"
                x1="32"
                y1="32"
                x2={tipX}
                y2={tipY}
              >
                <stop offset="0%" stopColor="#FFF7F2" />
                <stop offset="35%" stopColor="#FCE4E4" />
                <stop offset="70%" stopColor="#F6BFC1" />
                <stop offset="100%" stopColor={color} />
              </linearGradient>
            );
          })}
        </defs>

        {colors.map((_, i) => (
          <path
            key={i}
            d="M32 32 C21 26 21 14 32 5 C43 14 43 26 32 32Z"
            fill={`url(#${id}-petal-${i})`}
            transform={`rotate(${i * 45} 32 32)`}
          />
        ))}

        <circle cx="32" cy="32" r="5" fill="#FFF7F2" />
        <circle cx="32" cy="32" r="2.5" fill="#A83D55" />
      </svg>

      <span className="font-serif text-[30px] font-semibold tracking-tight text-[#542B35]">
        Nura
      </span>
    </div>
  );
}


function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-[#F0DDD5] bg-white/70 p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#8D4B5B]/5">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#FCE8E5] text-xl text-[#B84F69]">
        {icon}
      </div>
      <h3 className="mb-2 font-serif text-2xl text-[#542B35]">{title}</h3>
      <p className="text-sm leading-7 text-[#806B68]">{description}</p>
    </div>
  );
}

function LandingPage() {
  return (
    <main className="nura-page min-h-screen overflow-hidden text-[#542B35]">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-12 py-6">
        <a href="#" aria-label="Nura home">
          <NuraLogo />
        </a>

        <div className="hidden items-center gap-10 text-sm text-[#755B5D] md:flex">
          <a href="#features" className="transition hover:text-[#C84F6B]">Features</a>
          <a href="#how-it-works" className="transition hover:text-[#C84F6B]">How it works</a>
          <a href="#about" className="transition hover:text-[#C84F6B]">About Nura</a>
        </div>

        <Link
          to="/dashboard"
          className="rounded-full bg-[#C94F6C] px-6 py-3 text-sm font-medium text-white shadow-md shadow-[#C94F6C]/15 transition hover:bg-[#AA3D59]"
        >
          Get Started <span className="ml-2">→</span>
        </Link>
      </nav>

      {/* Hero */}
      <section className="nura-hero relative mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-12 pb-20 pt-12 lg:grid-cols-2 lg:pt-20">
        <div className="nura-hero-pattern absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 max-w-[620px]">
          <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#F0D8D2] bg-white/70 px-4 py-2 text-xs tracking-wide text-[#A65C68]">
            <span className="h-2 w-2 rounded-full bg-[#D76B81]" />
            A little more in tune with yourself
          </span>

          <h1 className="font-serif text-6xl leading-[1.08] tracking-tight text-[#542B35] md:text-7xl xl:text-[84px]">
            Understand
            <br />
            your cycle.
            <br />
            Understand
            <br />
            <span className="italic text-[#D65F78]">yourself.</span>
          </h1>

          <p className="mt-8 max-w-[470px] text-lg leading-8 text-[#806B68]">
            Track your period, discover your patterns, and
            prioritize your well-being — all in one place.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              to="/dashboard"
              className="rounded-full bg-[#C94F6C] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#C94F6C]/20 transition hover:-translate-y-0.5 hover:bg-[#AA3D59]"
            >
              Start Tracking Free <span className="ml-2">→</span>
            </Link>
            <a
              href="#features"
              className="text-sm font-medium text-[#895B60] transition hover:text-[#C94F6C]"
            >
              Explore Nura ↓
            </a>
          </div>

          <div className="mt-12 flex items-center gap-3 text-sm text-[#9A7776]">
            <span className="text-lg text-[#C94F6C]">♡</span>
            Your health journey, at your own pace.
          </div>
        </div>

        {/* Botanical hero artwork */}
        <div className="relative z-10 mx-auto h-[520px] w-full max-w-[570px]">
          <div className="absolute inset-5 rounded-[48%]" />
          <div className="absolute inset-0">
            <img src={botanicalArtwork} alt="Botanical artwork" className="h-full w-full object-cover" />
          </div>

          <div className="absolute bottom-10 left-2 rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-xl shadow-[#8D4B5B]/10 backdrop-blur-sm">
            <p className="text-xs text-[#A17C79]">Your cycle, your rhythm</p>
            <p className="mt-1 font-serif text-xl text-[#542B35]">
              Every phase matters.
            </p>
          </div>

          <div className="absolute right-0 top-12 rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-xl shadow-[#8D4B5B]/10 backdrop-blur-sm">
            <span className="text-xs text-[#A17C79]">A gentle reminder</span>
            <p className="mt-1 text-sm font-medium text-[#A94D64]">
              Take a moment for you ♡
            </p>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="mx-12 rounded-3xl border border-[#F0DDD5] bg-gradient-to-r from-[#FFF0E9] via-[#FCE8E3] to-[#FFF0E9] px-8 py-8">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {[
            ["♡", "Track your cycle"],
            ["✿", "Discover patterns"],
            ["⌁", "Monitor symptoms"],
            ["♧", "Understand your health"],
          ].map(([icon, label]) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span className="text-2xl text-[#C75C73]">{icon}</span>
              <span className="text-sm text-[#76595B]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-[1440px] px-12 py-28">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[.22em] text-[#C16B7B]">
            Made with you in mind
          </span>
          <h2 className="mt-5 font-serif text-5xl leading-tight text-[#542B35]">
            A more thoughtful way
            <br />
            to care for yourself.
          </h2>
          <p className="mt-5 leading-7 text-[#806B68]">
            Your cycle is personal. Nura helps you understand it with
            simple tools, meaningful insights, and a little more clarity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <FeatureCard
            icon="♡"
            title="Cycle tracking"
            description="Keep track of your periods, cycle dates, and upcoming phases in one simple space."
          />
          <FeatureCard
            icon="✿"
            title="Symptom journal"
            description="Record symptoms, moods, and daily experiences to notice patterns over time."
          />
          <FeatureCard
            icon="⌁"
            title="Personal insights"
            description="Explore your cycle history and understand trends through clear visual summaries."
          />
          <FeatureCard
            icon="♧"
            title="Health awareness"
            description="Access approachable educational information to make more informed decisions."
          />
        </div>
      </section>

      {/* About / privacy */}
      <section
        id="about"
        className="mx-12 grid gap-10 rounded-[36px] bg-gradient-to-br from-[#F9E8E1] via-[#FCEFE7] to-[#F5DFE0] px-10 py-16 md:grid-cols-2 md:items-center md:px-16"
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-[.2em] text-[#B65D70]">
            Your space. Your story.
          </span>
          <h2 className="mt-5 font-serif text-5xl leading-tight text-[#542B35]">
            Your health deserves
            <br />
            to be understood.
          </h2>
          <p className="mt-6 max-w-lg leading-8 text-[#806B68]">
            Nura brings your cycle information together in one thoughtful
            experience, so you can spend less time guessing and more time
            understanding your body.
          </p>
        </div>

        <div className="rounded-3xl border border-white/80 bg-[#FFF9F5] p-9 shadow-sm">
          <div className="mb-5 text-3xl text-[#C65D75]">✿</div>
          <h3 className="font-serif text-3xl text-[#542B35]">
            Privacy comes first.
          </h3>
          <p className="mt-4 leading-7 text-[#806B68]">
            Personal health information should be treated with care.
            Nura is designed with privacy and thoughtful data handling
            at its core.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        id="get-started"
        className="mx-auto max-w-4xl px-8 py-28 text-center"
      >
        <NuraLogo size={50} />
        <h2 className="mt-8 font-serif text-5xl leading-tight text-[#542B35]">
          Begin understanding
          <br />
          yourself a little better.
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-[#806B68]">
          A more personal way to track, learn, and care for your well-being.
        </p>
        <Link
          to="/dashboard"
          className="mt-8 inline-block rounded-full bg-[#C94F6C] px-9 py-4 text-sm font-semibold text-white shadow-lg shadow-[#C94F6C]/20 transition hover:bg-[#AA3D59]"
        >
          Get Started with Nura →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#F0DDD5] px-12 py-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 md:flex-row">
          <NuraLogo size={30} />
          <p className="text-xs text-[#A18480]">
            Made with care. © {new Date().getFullYear()} Nura.
          </p>
          <div className="flex gap-6 text-xs text-[#896D6B]">
            <a href="#about">Privacy</a>
            <a href="#features">Features</a>
            <Link to="/dashboard">Get started</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default LandingPage;
