"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SummaryCards({
  latestLocation,
  lastSeen,
  mostActiveZones,
}: {
  latestLocation?: string
  lastSeen?: string
  mostActiveZones: string[]
}) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Latest Location</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{latestLocation ?? "—"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Last Seen</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{lastSeen ? new Date(lastSeen).toLocaleString() : "—"}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Most Active Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {mostActiveZones?.length ? mostActiveZones.map((z, i) => <li key={i}>{z}</li>) : <li>—</li>}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
