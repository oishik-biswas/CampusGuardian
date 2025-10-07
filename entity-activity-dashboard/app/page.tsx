"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchPanel, type SearchParams } from "@/components/dashboard/search-panel"
import { TimelineChart } from "@/components/dashboard/timeline-chart"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { cn } from "@/lib/utils"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Network error")
  return res.json()
}

export default function Page() {
  const [params, setParams] = useState<SearchParams | null>(null)

  const searchQuery = useMemo(() => {
    if (!params) return null
    const usp = new URLSearchParams()
    usp.set("type", params.entityType)
    usp.set("q", params.query)
    usp.set("window", params.window)
    if (params.window === "custom" && params.from && params.to) {
      usp.set("from", params.from.toISOString())
      usp.set("to", params.to.toISOString())
    }
    return usp.toString()
  }, [params])

  const { data: entityData } = useSWR(params && searchQuery ? `/api/entity/search?${searchQuery}` : null, fetcher)

  const { data: timelineData } = useSWR(params && searchQuery ? `/api/entity/timeline?${searchQuery}` : null, fetcher)

  const { data: alertsData, mutate: mutateAlerts } = useSWR(
    params && searchQuery ? `/api/entity/alerts?${searchQuery}` : null,
    fetcher,
    { refreshInterval: 5000 },
  )

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 text-center">
        <h1 className="text-balance text-3xl font-semibold tracking-tight">Entity Activity Dashboard</h1>
        <p className="text-muted-foreground mt-1">Search and visualize activity timelines for entities.</p>
      </header>

      <section className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Search / Generate Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchPanel onSearch={setParams} />
          </CardContent>
        </Card>
      </section>

      {params ? (
        <section className="grid gap-6">
          <div className={cn("grid gap-6", "md:grid-cols-3")}>
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <TimelineChart data={timelineData?.points || []} config={timelineData?.chartConfig || {}} />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-1">
              <SummaryCards
                latestLocation={timelineData?.summary?.latestLocation}
                lastSeen={timelineData?.summary?.lastSeen}
                mostActiveZones={timelineData?.summary?.mostActiveZones || []}
              />
            </div>
          </div>

          <div>
            <AlertsPanel
              alerts={alertsData?.alerts || []}
              onAcknowledge={(id) => {
                // Optimistic UI: mark as acknowledged locally
                mutateAlerts(
                  (prev: any) => ({
                    ...prev,
                    alerts: prev.alerts.map((a: any) => (a.id === id ? { ...a, acknowledged: true } : a)),
                  }),
                  { revalidate: false },
                )
              }}
              onSilence={(id) => {
                mutateAlerts(
                  (prev: any) => ({
                    ...prev,
                    alerts: prev.alerts.map((a: any) => (a.id === id ? { ...a, silenced: true } : a)),
                  }),
                  { revalidate: false },
                )
              }}
            />
          </div>
        </section>
      ) : (
        <section className="mt-8">
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">Use the search panel above to select an entity and time window.</p>
            </CardContent>
          </Card>
        </section>
      )}
    </main>
  )
}
