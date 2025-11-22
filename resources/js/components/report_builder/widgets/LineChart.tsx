"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import Chart from "chart.js/auto"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface LineChartProps {
  data?: any
  width?: number
  height?: number
  title?: string
  description?: string
}

export default function LineChart({
  data,
  width = 600,
  height = 300,
  title = "Line Chart",
  description = "Interactive chart showing series data",
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<any>(null)

  if (!data?.sheets?.length) return <div style={{ width, height }}>No data</div>

  const sheetRaw: any[][] = data.sheets[0]

  if (!sheetRaw.length) return <div style={{ width, height }}>No data</div>

  // First row = x-axis labels
  const labels = sheetRaw[0]

  // Subsequent rows = datasets
  const datasetsRaw = sheetRaw.slice(1)

  // Dataset names
  const datasetNames = datasetsRaw.map((_, i) => `Series ${i + 1}`)

  // Active series state
  const [activeSeries, setActiveSeries] = useState<string[]>([...datasetNames])
  const toggleSeries = (name: string) =>
    setActiveSeries((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    )

  // Totals per dataset
  const totals = useMemo(() => {
    const result: Record<string, number> = {}
    datasetsRaw.forEach((row, i) => {
      result[datasetNames[i]] = row.reduce((acc, val) => acc + Number(val ?? 0), 0)
    })
    return result
  }, [datasetsRaw, datasetNames])

  // Chart.js datasets
  const chartData = useMemo(
    () => ({
      labels,
      datasets: datasetsRaw
        .map((row, i) => ({
          label: datasetNames[i],
          data: row,
          borderColor: `var(--chart-${i + 1})`,
          backgroundColor: `var(--chart-${i + 1})/20`,
          tension: 0.3,
          fill: false,
          pointRadius: 0,
        }))
        .filter((d) => activeSeries.includes(d.label)),
    }),
    [labels, datasetsRaw, datasetNames, activeSeries]
  )

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: chartData,
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: { tooltip: { mode: "index", intersect: false } },
        scales: { x: { ticks: { maxRotation: 45, minRotation: 0 } } },
      },
    })

    return () => chartRef.current?.destroy()
  }, [chartData, width, height])

return (
  <Card className="py-2 sm:py-0">
    <CardHeader className="flex flex-col sm:flex-row items-stretch border-b !p-0">
      {/* Left Side - Title + Description */}
      <div className="flex flex-1 flex-col justify-center gap-0.5 px-3 pb-2 sm:pb-0">
        <CardTitle className="text-xs font-semibold">{title}</CardTitle>
        <CardDescription className="text-[10px] leading-tight">
          {description}
        </CardDescription>
      </div>

      {/* Right Side - Series Buttons */}
      <div className="flex flex-wrap gap-1 px-2 pb-2 sm:pb-0">
        {datasetNames.map((name) => (
          <button
            key={name}
            onClick={() => toggleSeries(name)}
            className={`text-[9px] px-1.5 py-0.5 border rounded-sm ${
              activeSeries.includes(name)
                ? "bg-muted/50 border-muted"
                : "bg-transparent border-gray-300"
            }`}
          >
            {name}: {totals[name].toLocaleString()}
          </button>
        ))}
      </div>
    </CardHeader>

    <CardContent className="p-1 sm:p-2">
      <div className="w-full h-full relative">
        {/* Canvas fills container completely */}
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>
    </CardContent>

  </Card>
);

}
