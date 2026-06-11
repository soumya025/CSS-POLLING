// src/app/thank-you/page.tsx
// Shown after successful vote submission

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function ThankYouPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  // Make sure they actually voted
  const vote = await prisma.vote.findUnique({
    where: { email: session.user.email },
  });

  if (!vote) {
    redirect("/vote");
  }

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(vote.createdAt);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      {/* Confetti-like background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl animate-pulse-slow delay-200" />
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-blue-600/8 rounded-full blur-3xl animate-pulse-slow delay-300" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Success icon */}
        <div className="mb-8 animate-scale-in">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center shadow-2xl shadow-green-900/20">
            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Main card */}
        <div className="glass-card p-10 animate-fade-in-up">
          <p className="glow-badge mb-4 inline-block">Vote Recorded</p>
          <h1 className="text-3xl font-bold text-white mb-3">
            Thank You! 🎉
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Your feedback has been recorded successfully. Thank you for participating in the CSS AGS Feedback Poll.
          </p>

          {/* Vote summary */}
          <div className="bg-white/3 rounded-xl p-5 mb-6 text-left space-y-3 border border-white/5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">You voted for</span>
              <span className="text-indigo-300 font-semibold">{vote.candidate}</span>
            </div>
            <div className="border-t border-white/5" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Recorded at</span>
              <span className="text-gray-300 text-xs">{formattedDate} IST</span>
            </div>
            <div className="border-t border-white/5" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-300 text-xs truncate max-w-[180px]">{session.user.email}</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer-banner px-4 py-3 text-xs text-center mb-6">
            This poll is for feedback only. Official results do not depend on this poll.
          </div>

          {/* Sign out */}
<a 
href="/api/auth/signout"
  className="w-full block py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all duration-200 text-sm font-medium text-center"
>
  Sign Out
</a>
        </div>

        <p className="mt-8 text-gray-700 text-xs">
          © 2024 Computer Science Society, NIT Silchar
        </p>
      </div>
    </main>
  );
}
