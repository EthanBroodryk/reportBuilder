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
}

export default function BarChart({ data }: Props) {
  if (!data?.sheets?.length) return <p>No data</p>

  const sheetRaw: any[][] = data.sheets[0]
  if (!sheetRaw.length) return <p>No data</p>

  const labels = sheetRaw[0]
  const datasetsRaw = sheetRaw.slice(1)
  const datasetNames = datasetsRaw.map((_, i) => `Series ${i + 1}`)
  const [activeSeries, setActiveSeries] = React.useState<string[]>([...datasetNames])

  const toggleSeries = (name: string) => {
    setActiveSeries((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    )
  }

  const totals = React.useMemo(() => {
    const result: Record<string, number> = {}
    datasetsRaw.forEach((row, i) => {
      result[datasetNames[i]] = row.reduce((acc, val) => acc + Number(val ?? 0), 0)
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
        .filter((d) => activeSeries.includes(d.label)),
    }
  }, [labels, datasetsRaw, datasetNames, activeSeries])

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      x: { ticks: { maxRotation: 45, minRotation: 0 } },
    },
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>Showing totals for the selected series</CardDescription>
        </div>
        <div className="flex">
          {datasetNames.map((name) => (
            <button
              key={name}
              data-active={activeSeries.includes(name)}
              className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => toggleSeries(name)}
            >
              <span className="text-muted-foreground text-xs">{name}</span>
              <span className="text-lg leading-none font-bold sm:text-2xl">
                {totals[name].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <div className="h-[300px] w-full">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}
