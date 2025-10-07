import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type") || "student"
  const q = (searchParams.get("q") || "").trim()

  // Mocked match
  const entity = {
    type,
    id: q || "UNKNOWN",
    name: q || "Unknown",
  }

  return Response.json({ entity, matched: !!q })
}
