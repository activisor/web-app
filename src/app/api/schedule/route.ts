import type { NextRequest } from "next/server"
import { getToken } from 'next-auth/jwt';

export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET as string
  })
  if (token) {
    // Signed in
    const dto = await request.json();
    console.log("DTO", JSON.stringify(dto));

    const obj = { url: "/sheet" };
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json",
    });
    return new Response(blob);
  }
  return new Response();
}
