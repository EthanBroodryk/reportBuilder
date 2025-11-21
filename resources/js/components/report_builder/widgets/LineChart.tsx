import React, { useEffect, useRef, useState, useMemo } from "react";
import Chart from "chart.js/auto";

interface LineChartProps {
  data?: any;
  width?: number;
  height?: number;
}

export default function LineChart({
  data,
  width = 300,
  height = 200,
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<any>(null);

  if (!data?.sheets?.length) return <div style={{ width, height }}>No data</div>;

  const sheetRaw: any[][] = data.sheets[0];

  if (!sheetRaw.length) return <div style={{ width, height }}>No data</div>;

  // First row = x-axis labels
  const labels = sheetRaw[0];

  // Subsequent rows = datasets
  const datasetsRaw = sheetRaw.slice(1);

  // Use first column as series names if you like, else default names
  const datasetNames = datasetsRaw.map((row, i) => `Series ${i + 1}`);

  // State to track active datasets
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

  // Prepare Chart.js datasets
  const chartData = useMemo(
    () => ({
      labels,
      datasets: datasetsRaw
        .map((row, i) => ({
          label: datasetNames[i],
          data: row,
          borderColor: `hsl(${i * 60}, 70%, 40%)`,
          backgroundColor: `hsla(${i * 60}, 70%, 40%, 0.2)`,
          tension: 0.3,
          fill: false,
          pointRadius: 0,
        }))
        .filter((d) => activeSeries.includes(d.label)),
    }),
    [labels, datasetsRaw, datasetNames, activeSeries]
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: chartData,
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: { tooltip: { mode: "index", intersect: false } },
        scales: { x: { ticks: { maxRotation: 45, minRotation: 0 } } },
      },
    });

    return () => chartRef.current?.destroy();
  }, [chartData, width, height]);

  return (
    <div style={{ width, height, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
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
