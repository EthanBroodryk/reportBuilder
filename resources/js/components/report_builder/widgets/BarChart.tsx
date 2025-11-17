import React from 'react';
import { Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface Props {
  data?: any;
}

export default function BarChart({ data }: Props) {
  if (!data?.sheets?.length) return <p>No data</p>;

  const sheet = data.sheets[0];
  const labels = sheet.map((_: any, i: number) => `Row ${i + 1}`); // fix here

  const datasetKeys = Object.keys(sheet[0] || {});
  const chartData: ChartData<'bar'> = {
    labels,
    datasets: datasetKeys.map((key, i) => ({
      label: key,
      data: sheet.map((row: any) => row[key]),
      backgroundColor: `hsla(${i * 90}, 70%, 50%, 0.5)`,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  return <Bar data={chartData} options={options} />;
}
