// src/app/vote/page.tsx
// Main voting page — server component, redirects if not auth'd or already voted

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VotingUI from "@/components/VotingUI";
import Image from "next/image";


const CANDIDATES = [
  {
    name: "Raunak Bhattacharjee",
    photo: "/images/raunak.jpg",
    description: "Candidate for AGS Position",
  },
  {
    name: "Rishi Karmakar",
    photo: "/images/rishi.jpg",
    description: "Candidate for AGS Position",
  },
];

export default async function VotePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  // Check if already voted
  const existingVote = await prisma.vote.findUnique({
    where: { email: session.user.email },
  });

  if (existingVote) {
    redirect("/thank-you");
  }

  // Block admins from voting page (they go to dashboard)
  const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
  if (ADMIN_EMAILS.includes(session.user.email)) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="min-h-screen px-4 py-12">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-lg font-black text-white shadow-lg">
  <Image
    src="/images/css-logo.png"
    alt="CSS Logo"
    fill
    className="object-contain"
  />
  <span className="absolute"></span>
</div>
            <div>
              <p className="text-xs text-indigo-400 font-medium uppercase tracking-widest">Computer Science Society</p>
              <p className="text-white font-semibold">NIT Silchar</p>
            </div>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-3">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full ring-2 ring-indigo-500/40"
              />
            )}
            <p className="text-gray-400 text-sm hidden sm:block truncate max-w-[200px]">
              {session.user.email}
            </p>
<a
  href="/api/auth/signout"
  className="text-gray-500 hover:text-red-400 transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-red-400/10 border border-transparent hover:border-red-400/20"
>
  Sign out
</a>
          </div>
        </div>

        {/* Title section */}
        <div className="text-center mb-8 animate-fade-in-up delay-100">
          <p className="glow-badge mb-4 inline-block">AGS Position 2024</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            CSS AGS{" "}
            <span className="gradient-text">Feedback Poll</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Cast your vote for the Assistant General Secretary position.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer-banner px-6 py-4 text-sm text-center mb-10 animate-fade-in-up delay-200">
          <strong>⚠️ Important Disclaimer:</strong>{" "}
          This poll is only intended to collect members feedback. Official election results do not depend on this poll.
        </div>

        {/* Voting UI (Client Component) */}
        <VotingUI candidates={CANDIDATES} userEmail={session.user.email} />

        {/* Footer */}
        <p className="text-center text-gray-700 text-xs mt-12 animate-fade-in-up delay-400">
          © 2024 Computer Science Society, NIT Silchar
        </p>
      </div>
    </main>
  );
}
