"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import Chart from "chart.js/auto"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface LineChartProps {
  data?: any
  title?: string
  description?: string
}

export default function LineChart({
  data,
  title = "Line Chart",
  description = "Interactive chart showing series data",
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // ✅ Guard
  if (!data?.sheets?.length)
    return <div className="flex items-center justify-center w-full h-full">No data</div>

  const sheetRaw: any[][] = data.sheets[0]
  if (!sheetRaw.length)
    return <div className="flex items-center justify-center w-full h-full">No data</div>

  // ✅ FIXED PARSING FOR EXCEL FORMAT
  const labels = sheetRaw[0].slice(1) // Months (x-axis)
  const datasetsRaw = sheetRaw.slice(1) // Rows after header

  const datasetNames = datasetsRaw.map((row) => row[0]) // First column = series name
  const datasetValues = datasetsRaw.map((row) => row.slice(1)) // Remaining columns = values

  // ✅ All series active by default
  const [activeSeries, setActiveSeries] = useState<string[]>([...datasetNames])

  const toggleSeries = (name: string) =>
    setActiveSeries((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    )

  // ✅ Totals for button labels
  const totals = useMemo(() => {
    const result: Record<string, number> = {}
    datasetValues.forEach((row, i) => {
      result[datasetNames[i]] = row.reduce((acc, val) => acc + Number(val ?? 0), 0)
    })
    return result
  }, [datasetValues, datasetNames])

  // ✅ Build chart dataset
  const chartData = useMemo(() => {
    return {
      labels,
      datasets: datasetValues
        .map((row, i) => {
          const hue = (i * 360) / datasetValues.length
          return {
            label: datasetNames[i],
            data: row,
            borderColor: `hsl(${hue}, 70%, 50%)`,
            backgroundColor: `hsl(${hue}, 70%, 50%, 0.25)`,
            tension: 0.3,
            fill: false,
            pointRadius: 0,
          }
        })
        .filter((d) => activeSeries.includes(d.label)),
    }
  }, [labels, datasetValues, datasetNames, activeSeries])

  // ✅ Responsive sizing (no oversized chart)
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const pixelRatio = window.devicePixelRatio || 1

    canvas.width = rect.width * pixelRatio
    canvas.height = rect.height * pixelRatio
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvas, {
      type: "line",
      data: chartData,
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          tooltip: { mode: "index", intersect: false },
          legend: { display: false },
        },
        scales: {
          x: { ticks: { maxRotation: 45 } },
          y: { ticks: { autoSkip: true } },
        },
      },
    })

    return () => chartRef.current?.destroy()
  }, [chartData])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-col sm:flex-row items-stretch border-b !p-0">
        <div className="flex flex-1 flex-col justify-center gap-0.5 px-2 py-1 sm:py-0">
          <CardTitle className="text-xs font-semibold">{title}</CardTitle>
          <CardDescription className="text-[10px] leading-tight">{description}</CardDescription>
        </div>

        <div className="flex flex-wrap gap-1 px-2 py-1 sm:py-0">
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

      <CardContent className="flex-1 p-0">
        <div ref={containerRef} className="w-full h-full relative">
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  )
}
