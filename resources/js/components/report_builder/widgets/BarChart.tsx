"use client"

import * as React from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  data?: any
  width?: number
  height?: number
}

export default function BarChart({ data, width, height }: Props) {
  if (!data?.sheets?.length) return <p>No data</p>

  const sheetRaw: any[][] = data.sheets[0]
  if (!sheetRaw.length) return <p>No data</p>

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
  const [activeSeries, setActiveSeries] = React.useState<string[]>([...datasetNames])

  const toggleSeries = (name: string) => {
    setActiveSeries(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }

  const totals = React.useMemo(() => {
    const result: Record<string, number> = {}
    datasetsRaw.forEach((row, i) => {
      result[datasetNames[i]] = row.reduce((acc, val) => acc + val, 0)
    })
    return result
  }, [datasetsRaw, datasetNames])

  const chartData = React.useMemo(() => {
    return {
      labels,
      datasets: datasetsRaw
        .map((row, i) => ({
          label: datasetNames[i],
          data: row,
          backgroundColor: `hsl(${i * 60}, 70%, 50%)`,
        }))
        .filter(d => activeSeries.includes(d.label)),
    }
  }, [labels, datasetsRaw, datasetNames, activeSeries])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { ticks: { maxRotation: 45, minRotation: 0 } },
      y: { ticks: { autoSkip: true } },
    },
  }

  return (
    <Card className="py-0 h-full w-full flex flex-col">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-0.5 px-3 py-2">
          <CardTitle className="text-xs sm:text-sm">Bar Chart</CardTitle>
          <CardDescription className="text-[10px] sm:text-xs">
            Totals per series
          </CardDescription>
        </div>

        {/* Toggle buttons for datasets */}
        <div className="flex flex-wrap gap-1 px-2 py-1">
          {datasetNames.map(name => (
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

      <CardContent className="p-1 flex-1">
        <div
          className="w-full h-full relative"
          style={{ minHeight: 40 }}
        >
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
