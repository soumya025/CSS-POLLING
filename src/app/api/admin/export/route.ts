// src/app/api/admin/export/route.ts
// GET /api/admin/export — download all votes as CSV (admin only)

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response!;

  try {
    const votes = await prisma.vote.findMany({
      orderBy: { createdAt: "asc" },
    });

    const header = "ID,Email,Candidate,Timestamp\n";
    const rows = votes
      .map(
        (v) =>
          `${v.id},${v.email},${v.candidate},${v.createdAt.toISOString()}`
      )
      .join("\n");

    const csv = header + rows;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="css-ags-votes-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
