import type { NextRequest } from "next/server"

const zones = ["Block A", "Block B", "Block C", "Library", "Cafeteria"]

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const win = searchParams.get("window") || "last24h"
  const fromParam = searchParams.get("from")
  const toParam = searchParams.get("to")

  const now = new Date()
  let from = new Date(now)
  if (win === "today") {
    from.setHours(0, 0, 0, 0)
  } else if (win === "last24h") {
    from = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  } else if (win === "custom" && fromParam && toParam) {
    from = new Date(fromParam)
  }

  const to = win === "custom" && toParam ? new Date(toParam) : now

  // Generate points every hour
  const points: any[] = []
  const cursor = new Date(from)
  while (cursor <= to) {
    const zone = zones[randomBetween(0, zones.length - 1)]
    const activity = randomBetween(0, 10)
    // Explainability note
    const explain =
      activity > 7
        ? `Predicted based on last Wi-Fi access at ${zone}, ${cursor.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`
        : undefined

    points.push({
      time: cursor.toISOString(),
      activity,
      zone,
      explain,
    })
    cursor.setHours(cursor.getHours() + 1)
  }

  // Summary
  const latest = points[points.length - 1]
  const zoneCounts = points.reduce<Record<string, number>>((acc, p) => {
    acc[p.zone] = (acc[p.zone] || 0) + p.activity
    return acc
  }, {})
  const mostActiveZones = Object.entries(zoneCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([z]) => z)

  const chartConfig = {
    activity: {
      label: "Activity",
      color: "oklch(0.6 0.118 184.704)", // use configured chart token-esque color
    },
  }

  return Response.json({
    points,
    summary: {
      latestLocation: latest?.zone || null,
      lastSeen: latest?.time || null,
      mostActiveZones,
    },
    chartConfig,
  })
}
