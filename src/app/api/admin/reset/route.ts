// src/app/api/admin/reset/route.ts
// DELETE /api/admin/reset — wipes all votes (admin only)

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  const { authorized, response } = await requireAdmin();
  if (!authorized) return response!;

  try {
    const { count } = await prisma.vote.deleteMany({});
    return NextResponse.json({ success: true, deleted: count });
  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
