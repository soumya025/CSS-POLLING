// src/app/api/admin/stats/route.ts
// GET /api/admin/stats — returns full vote data for admin dashboard

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response!;

  try {
    const votes = await prisma.vote.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Aggregate counts per candidate
    const counts: Record<string, number> = {};
    for (const vote of votes) {
      counts[vote.candidate] = (counts[vote.candidate] || 0) + 1;
    }

    const total = votes.length;

    const candidates = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : "0.0",
    }));

    return NextResponse.json({ total, candidates, votes });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
