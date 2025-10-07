import type { NextRequest } from "next/server"

function randBool(p = 0.5) {
  return Math.random() < p
}

export async function GET(req: NextRequest) {
  const base = Date.now()
  const alerts = [
    {
      id: "a1",
      message: "Not seen for last 12 hours",
      level: "red",
      acknowledged: false,
      silenced: false,
      createdAt: new Date(base - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "a2",
      message: "Abnormal movement detected near Block C",
      level: "red",
      acknowledged: randBool(0.2),
      silenced: randBool(0.1),
      createdAt: new Date(base - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "a3",
      message: "Device reported normal check-in",
      level: "green",
      acknowledged: true,
      silenced: false,
      createdAt: new Date(base - 1000 * 60 * 75).toISOString(),
    },
  ]
  return Response.json({ alerts })
}
