"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface Props {
  data?: any
  width?: number
  height?: number
}

export default function Table({ data, width = 300, height = 200 }: Props) {
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

  const headers = sheetRaw[0]
  const rows = sheetRaw.slice(1)
  const datasetNames = rows.map((_, i) => `Row ${i + 1}`)
  const [activeRows, setActiveRows] = React.useState<string[]>([...datasetNames])

  const toggleRow = (name: string) => {
    setActiveRows((prev) =>
      prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]
    )
  }

  const rowTotals = React.useMemo(() => {
    const result: Record<string, number> = {}
    rows.forEach((row, i) => {
      result[datasetNames[i]] = row.reduce((acc, val) => acc + Number(val ?? 0), 0)
    })
    return result
  }, [rows, datasetNames])

  const columnTotals = React.useMemo(() => {
    return headers.map((_, colIdx) =>
      rows.reduce((acc, row, rowIdx) => {
        const name = datasetNames[rowIdx]
        if (!activeRows.includes(name)) return acc
        return acc + Number(row[colIdx] ?? 0)
      }, 0)
    )
  }, [rows, headers, datasetNames, activeRows])

  return (
    <Card className="w-full overflow-auto">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Data Table</CardTitle>
          <CardDescription>Showing all active rows and totals</CardDescription>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {datasetNames.map((name) => (
            <button
              key={name}
              onClick={() => toggleRow(name)}
              className={`px-3 py-1 text-sm rounded border ${
                activeRows.includes(name)
                  ? "bg-muted text-muted-foreground border-muted"
                  : "bg-transparent text-gray-700 border-gray-300"
              }`}
            >
              {name}: {rowTotals[name].toLocaleString()}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="min-w-full overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <caption className="sr-only">A summary of your dataset.</caption>
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row, i) => {
                const name = datasetNames[i]
                if (!activeRows.includes(name)) return null
                return (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    {row.map((value, j) => (
                      <td
                        key={j}
                        className="px-4 py-2 whitespace-nowrap text-sm text-gray-900"
                      >
                        {value ?? 0}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>

            <tfoot className="bg-gray-100">
              <tr>
                {columnTotals.map((total, idx) => (
                  <td
                    key={idx}
                    className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-900"
                  >
                    {total}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
