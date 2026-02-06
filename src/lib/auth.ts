import { SignJWT } from "jose";

const encoder = new TextEncoder();

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return encoder.encode(secret);
}

export async function signUserToken(user: { id: string; email: string }) {
  const secret = getJwtSecret();
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}
