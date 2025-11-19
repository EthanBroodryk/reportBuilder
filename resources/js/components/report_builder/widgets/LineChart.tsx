import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface LineChartProps {
  data?: any;
}

export default function LineChart({ data }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  if (!data?.sheets?.length) return <p>No data</p>;

  const sheet = data.sheets[0];
  const labels = sheet.map((_: any, i: number) => `Row ${i + 1}`);
  const datasetKeys = Object.keys(sheet[0] || {});

  const chartData = {
    labels,
    datasets: datasetKeys.map((key, i) => ({
      label: key,
      data: sheet.map((row: any) => row[key]),
      borderColor: `hsl(${i * 90}, 70%, 50%)`,
      backgroundColor: `hsla(${i * 90}, 70%, 50%, 0.4)`,
      fill: false,
      tension: 0.3,
    })),
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [data]);

  return <canvas ref={canvasRef} />;
}
