import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface PieChartProps {
  data?: any;
}

export default function PieChart({ data }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  if (!data?.sheets?.length) return <p>No data</p>;

  const sheet = data.sheets[0];

  const keys = Object.keys(sheet[0] || {});
  const firstKey = keys[0]; // pick first column

  const labels = sheet.map((_: any, i: number) => `Row ${i + 1}`);
  const values = sheet.map((row: any) => row[firstKey]);

  const chartData = {
    labels,
    datasets: [
      {
        label: firstKey,
        data: values,
        backgroundColor: labels.map(
  (_: any, i: number) => `hsla(${i * 45}, 70%, 50%, 0.8)`
)

      },
    ],
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: "pie",
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
