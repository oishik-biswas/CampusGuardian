"use client"

import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

type TimelinePoint = {
  time: string // ISO time
  activity: number
  zone: string
  explain?: string
}

export function TimelineChart({
  data,
  config,
}: {
  data: TimelinePoint[]
  config: Record<string, any>
}) {
  const parsed = data?.map((d) => ({
    ...d,
    // format hour label for x-axis
    hour: new Date(d.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    value: d.activity,
    label: d.zone,
  }))

  return (
    <ChartContainer config={config}>
      <ResponsiveContainer>
        <AreaChart data={parsed}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis allowDecimals={false} />
          <Tooltip
            content={
              <ChartTooltipContent
                formatter={(val, _name, item: any) => {
                  const p = item?.payload
                  const lines = [
                    p?.label ? `Zone: ${p.label}` : undefined,
                    typeof val === "number" ? `Activity: ${val}` : undefined,
                    p?.explain ? `Note: ${p.explain}` : undefined,
                  ].filter(Boolean)
                  return (
                    <div className="grid gap-1">
                      {lines.map((line: string, idx: number) => (
                        <span key={idx}>{line}</span>
                      ))}
                    </div>
                  )
                }}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-activity)"
            fill="var(--color-activity)"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
