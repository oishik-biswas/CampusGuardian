"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type AlertItem = {
  id: string
  message: string
  level: "green" | "red" | "yellow"
  acknowledged?: boolean
  silenced?: boolean
  createdAt: string
}

export function AlertsPanel({
  alerts,
  onAcknowledge,
  onSilence,
}: {
  alerts: AlertItem[]
  onAcknowledge: (id: string) => void
  onSilence: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {!alerts?.length && <p className="text-muted-foreground">No alerts at this time.</p>}
        {alerts.map((a) => {
          const badge =
            a.level === "green"
              ? { label: "Normal", className: "bg-emerald-500 text-white" }
              : a.level === "red"
                ? { label: "Anomaly", className: "bg-red-500 text-white" }
                : { label: "Warning", className: "bg-amber-500 text-black" }

          return (
            <div
              key={a.id}
              className={cn("flex items-start justify-between rounded-md border p-3", a.silenced && "opacity-60")}
              role="region"
              aria-live="polite"
            >
              <div className="grid gap-1">
                <div className="flex items-center gap-2">
                  <Badge className={badge.className}>{badge.label}</Badge>
                  <span className="text-sm text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</span>
                </div>
                <p>{a.message}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onAcknowledge(a.id)} disabled={!!a.acknowledged}>
                  {a.acknowledged ? "Acknowledged" : "Acknowledge"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onSilence(a.id)} disabled={!!a.silenced}>
                  {a.silenced ? "Silenced" : "Silence"}
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
