import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signUserToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const password = String(body.password || "").trim();
  const name = body.name ? String(body.name).trim() : null;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || undefined,
    },
  });

  const token = await signUserToken({ id: user.id, email: user.email });

  return NextResponse.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}
