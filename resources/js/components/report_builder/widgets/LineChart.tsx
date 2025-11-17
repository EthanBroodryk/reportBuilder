import React from 'react';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface Props {
  data?: any;
}

export default function LineChart({ data }: Props) {
  if (!data?.sheets?.length) return <p>No data</p>;

  const sheet = data.sheets[0]; // take first sheet
  const labels = sheet[0]?.map((_: any, i: number) => `Row ${i + 1}`) || [];

  const datasetKeys = Object.keys(sheet[0] || {});
  const chartData: ChartData<'line'> = {
    labels,
    datasets: datasetKeys.map((key, i) => ({
      label: key,
      data: sheet.map((row: any) => row[key]),
      borderColor: `hsl(${i * 90}, 70%, 50%)`,
      backgroundColor: `hsla(${i * 90}, 70%, 50%, 0.3)`,
    })),
  };

  const options: ChartOptions<'line'> = { responsive: true, plugins: { legend: { position: 'top' } } };

  return <Line data={chartData} options={options} />;
}
