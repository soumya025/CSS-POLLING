// src/app/page.tsx
// Landing page — shows login or redirects authenticated users

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to vote page (or admin if applicable)
  if (session?.user) {
    const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
    if (ADMIN_EMAILS.includes(session.user.email || "")) {
      redirect("/admin/dashboard");
    } else {
      redirect("/vote");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow delay-200" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Logo */}
        <div className="mb-8 animate-float">
<div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-3xl font-black text-white shadow-2xl shadow-indigo-900/50 overflow-hidden">
  <Image
    src="/images/css-logo.png"
    alt="CSS Logo"
    fill
    className="object-contain p-1"
  />
  <span className="absolute"></span>
</div>
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-fade-in-up">
          <p className="glow-badge mb-4">NIT Silchar</p>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Computer Science 
            <span className="gradient-text block">Society</span>
          </h1>
          <p className="text-gray-400 text-lg mt-3">AGS (Assistant General Secretary) Feedback Poll 2026</p>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer-banner px-5 py-4 text-sm text-center mb-8 animate-fade-in-up delay-100 w-full">
          <span className="font-semibold">⚠️ Note:</span>{" "}
          This poll is only intended to collect members feedback. Official results do not depend on this poll.
        </div>

        {/* Login card */}
        <div className="glass-card p-8 w-full animate-scale-in delay-200">
          <h2 className="text-xl font-semibold text-white text-center mb-2">
            Sign in to Vote
          </h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Only <span className="text-indigo-400 font-medium">@cse.nits.ac.in</span> emails are allowed.
          </p>
          <LoginButton />
        </div>

        {/* Footer */}
        <p className="mt-8 text-gray-600 text-xs text-center animate-fade-in-up delay-300">
          © 2024 Computer Science Society, NIT Silchar. All rights reserved.
        </p>
      </div>
    </main>
  );
}
