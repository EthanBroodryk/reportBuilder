import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

interface Props {
  data?: any;
}

export default function BarChart({ data }: Props) {
  if (!data?.sheets?.length) return <p>No data</p>;

  const sheetRaw: any[][] = data.sheets[0];

  if (!sheetRaw.length) return <p>No data</p>;

  // First row = x-axis labels
  const labels = sheetRaw[0];

  // Subsequent rows = datasets
  const datasetsRaw = sheetRaw.slice(1);

  // Default dataset names
  const datasetNames = datasetsRaw.map((row, i) => `Series ${i + 1}`);

  // Active series state
  const [activeSeries, setActiveSeries] = React.useState<string[]>([...datasetNames]);

  const toggleSeries = (name: string) => {
    setActiveSeries((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const totals = useMemo(() => {
    const result: Record<string, number> = {};
    datasetsRaw.forEach((row, i) => {
      result[datasetNames[i]] = row.reduce((acc, val) => acc + Number(val ?? 0), 0);
    });
    return result;
  }, [datasetsRaw, datasetNames]);

  const chartData: ChartData<"bar"> = useMemo(
    () => ({
      labels,
      datasets: datasetsRaw
        .map((row, i) => ({
          label: datasetNames[i],
          data: row,
          backgroundColor: `hsla(${i * 60}, 70%, 50%, 0.5)`,
        }))
        .filter((d) => activeSeries.includes(d.label)),
    }),
    [labels, datasetsRaw, datasetNames, activeSeries]
  );

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: {
      x: { ticks: { maxRotation: 45, minRotation: 0 } },
    },
  };

  return (
    <div>
      {/* Series toggles */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
        {datasetNames.map((name) => (
          <button
            key={name}
            onClick={() => toggleSeries(name)}
            style={{
              padding: "2px 6px",
              fontSize: 12,
              cursor: "pointer",
              backgroundColor: activeSeries.includes(name)
                ? `hsl(${datasetNames.indexOf(name) * 60}, 70%, 90%)`
                : "transparent",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            {name}: {totals[name].toLocaleString()}
          </button>
        ))}
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
}
