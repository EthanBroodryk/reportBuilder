// LineChart.tsx (simplified)
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface LineChartProps {
  data?: any;
  width?: number;
  height?: number;
}

export default function LineChart({ data, width = 300, height = 200 }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<any>(null);

  if (!data?.sheets?.length) return <div style={{ width, height }}>No data</div>;

  const sheet = data.sheets[0];
  const labels = sheet.map((_: any, i: number) => `Row ${i + 1}`);
  const keys = Object.keys(sheet[0] || {});
  const chartData = {
    labels,
    datasets: keys.map((key: string, i: number) => ({
      label: key,
      data: sheet.map((row: any) => row[key]),
      borderColor: `hsl(${i * 60}, 70%, 40%)`,
      backgroundColor: `hsla(${i * 60}, 70%, 40%, 0.2)`,
      tension: 0.3,
    })),
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: chartData,
      options: {
        responsive: false,
        maintainAspectRatio: false,
      },
    });

    return () => chartRef.current?.destroy();
  }, [data, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}
