"use client"

import React, { useEffect, useRef, useState, useMemo } from "react"
import Chart from "chart.js/auto"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface PieChartProps {
  data?: any
  width?: number
  height?: number
}

export default function PieChart({ data, width = 300, height = 300 }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart | null>(null)

  if (!data?.sheets?.length)
    return (
      <div style={{ width, height }} className="flex items-center justify-center">
        No data
      </div>
    )

  const sheetRaw: any[][] = data.sheets[0]

  if (!sheetRaw.length)
    return (
      <div style={{ width, height }} className="flex items-center justify-center">
        No data
      </div>
    )

  // --- Process data dynamically ---
  let labels: string[] = []
  let datasetsRaw: number[][] = []

  const firstRow = sheetRaw[0]

  // Detect Example 1 (multiple columns) vs Example 2 (single column)
  if (firstRow.length > 2) {
    // Example 1: first row = headers (months), first column = products
    labels = sheetRaw[0].slice(1) // months as labels
    datasetsRaw = sheetRaw.slice(1).map(row =>
      row.slice(1).map((v: any) => Number(v ?? 0))
    )
  } else {
    // Example 2: first column = labels, second column = values
    labels = sheetRaw.slice(1).map(row => String(row[0])) // months
    datasetsRaw = [sheetRaw.slice(1).map(row => Number(row[1] ?? 0))] // single dataset
  }

  // Dataset names
  const datasetNames = datasetsRaw.map((_, i) => `Series ${i + 1}`)
  const [activeSeries, setActiveSeries] = useState<string[]>([...datasetNames])

  const toggleSeries = (name: string) => {
    setActiveSeries(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }

  const totals = useMemo(() => {
    const result: Record<string, number> = {}
    datasetsRaw.forEach((row, i) => {
      result[datasetNames[i]] = row.reduce((acc, val) => acc + val, 0)
    })
    return result
  }, [datasetsRaw, datasetNames])

  const chartData = useMemo(
    () => ({
      labels,
      datasets: datasetsRaw
        .map((row, i) => ({
          label: datasetNames[i],
          data: row,
          backgroundColor: labels.map(
            (_: any, j: number) => `hsla(${j * 45}, 70%, 50%, 0.8)`
          ),
        }))
        .filter(d => activeSeries.includes(d.label)),
    }),
    [labels, datasetsRaw, datasetNames, activeSeries]
  )

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: "pie",
      data: chartData,
      options: {
        responsive: false,
        plugins: {
          legend: { position: "top" },
        },
      },
    })

    return () => chartRef.current?.destroy()
  }, [chartData])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Pie Chart</CardTitle>
          <CardDescription>Showing distribution of active series</CardDescription>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {datasetNames.map(name => (
            <button
              key={name}
              onClick={() => toggleSeries(name)}
              className={`px-3 py-1 text-sm rounded border ${
                activeSeries.includes(name)
                  ? "bg-muted text-muted-foreground border-muted"
                  : "bg-transparent text-gray-700 border-gray-300"
              }`}
            >
              {name}: {totals[name].toLocaleString()}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex justify-center items-center p-6">
        <canvas ref={canvasRef} width={width} height={height} />
      </CardContent>
    </Card>
  )
}
