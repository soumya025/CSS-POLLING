// src/app/api/vote/route.ts
// POST /api/vote — cast a vote (authenticated, once per user)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";        // ← was: import { auth } from "@/auth"
import { authOptions } from "@/auth";                 // ← added
import { prisma } from "@/lib/prisma";

const VALID_CANDIDATES = ["Raunak Bhattacharjee", "Rishi Karmakar"];
const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN || "cse.nits.ac.in";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);  // ← was: await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const email = session.user.email;

    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      return NextResponse.json({ error: "Invalid email domain" }, { status: 403 });
    }

    const body = await req.json();
    const { candidate } = body;

    if (!candidate || !VALID_CANDIDATES.includes(candidate)) {
      return NextResponse.json({ error: "Invalid candidate" }, { status: 400 });
    }

    const existing = await prisma.vote.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }

    await prisma.vote.create({ data: { email, candidate } });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json({ error: "Already voted" }, { status: 409 });
    }
    console.error("Vote API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);  // ← was: await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ hasVoted: false, candidate: null });
    }

    const vote = await prisma.vote.findUnique({
      where: { email: session.user.email },
    });

    return NextResponse.json({
      hasVoted: !!vote,
      candidate: vote?.candidate || null,
    });
  } catch (error) {
    console.error("Vote check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}