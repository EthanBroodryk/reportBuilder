import React, { useEffect, useRef, useState, useMemo } from "react";
import Chart from "chart.js/auto";

interface PieChartProps {
  data?: any;
  width?: number;
  height?: number;
}

export default function PieChart({ data, width = 300, height = 300 }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  if (!data?.sheets?.length) return <p>No data</p>;

  const sheetRaw: any[][] = data.sheets[0];

  if (!sheetRaw.length) return <p>No data</p>;

  // First row = labels
  const labels = sheetRaw[0];

  // Subsequent rows = datasets
  const datasetsRaw = sheetRaw.slice(1);

  // Default dataset names
  const datasetNames = datasetsRaw.map((row, i) => `Series ${i + 1}`);

  // Active series state
  const [activeSeries, setActiveSeries] = useState<string[]>([...datasetNames]);

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
        .filter((d) => activeSeries.includes(d.label)),
    }),
    [labels, datasetsRaw, datasetNames, activeSeries]
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "pie",
      data: chartData,
      options: {
        responsive: false,
        plugins: {
          legend: { position: "top" },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [chartData]);

  return (
    <div style={{ width, height, display: "flex", flexDirection: "column" }}>
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
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}
