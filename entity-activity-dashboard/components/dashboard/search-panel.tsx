"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"

export type TimeWindow = "today" | "last24h" | "custom"
export type SearchParams = {
  entityType: "student" | "staff" | "device" | "asset"
  query: string
  window: TimeWindow
  from?: Date | null
  to?: Date | null
}

export function SearchPanel({ onSearch }: { onSearch: (p: SearchParams) => void }) {
  const [entityType, setEntityType] = useState<SearchParams["entityType"]>("student")
  const [query, setQuery] = useState("")
  const [window, setWindow] = useState<TimeWindow>("last24h")
  const [dateOpen, setDateOpen] = useState(false)
  const [from, setFrom] = useState<Date | null>(null)
  const [to, setTo] = useState<Date | null>(null)

  function submit() {
    const payload: SearchParams = { entityType, query: query.trim(), window }
    if (window === "custom") {
      payload.from = from
      payload.to = to
    }
    onSearch(payload)
  }

  const canCustomSearch = window !== "custom" || (from && to)

  return (
    <form
      className="grid gap-4 md:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="entityType">Entity Type</Label>
        <Select value={entityType} onValueChange={(v: any) => setEntityType(v)}>
          <SelectTrigger id="entityType" aria-label="Select entity type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="device">Device</SelectItem>
            <SelectItem value="asset">Asset</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="query">Entity ID or Name</Label>
        <Input
          id="query"
          placeholder="e.g., STU-1024 or Jane Doe"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="timeWindow">Time Window</Label>
        <Select value={window} onValueChange={(v: any) => setWindow(v)}>
          <SelectTrigger id="timeWindow" aria-label="Select time window">
            <SelectValue placeholder="Select window" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today till now</SelectItem>
            <SelectItem value="last24h">Last 24 hours</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {window === "custom" && (
        <div className="md:col-span-4">
          <Label className="sr-only">Custom range</Label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" type="button" className="w-full justify-start bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {from && to ? `${from.toDateString()} - ${to.toDateString()}` : "Pick a date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side="bottom"
              align="start"
              sticky="always"
              collisionPadding={10}
              avoidCollisions={false}
              className="w-[min(92vw,680px)] max-h-[70vh] overflow-auto p-3"
            >
              <div className="grid gap-3">
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>From</Label>
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={from ?? undefined}
                      onSelect={(d) => setFrom(d ?? null)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>To</Label>
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={to ?? undefined}
                      onSelect={(d) => setTo(d ?? null)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setFrom(null)
                      setTo(null)
                    }}
                  >
                    Clear
                  </Button>
                  <Button type="button" onClick={() => setDateOpen(false)} disabled={!from || !to}>
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      <div className="md:col-span-4 flex justify-end">
        <Button type="submit" disabled={!query.trim() || !canCustomSearch}>
          Search / Generate Timeline
        </Button>
      </div>
    </form>
  )
}
