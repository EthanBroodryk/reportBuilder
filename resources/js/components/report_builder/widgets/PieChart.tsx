import React from 'react';
import { Pie } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';

interface Props {
  data?: any;
}

export default function PieChart({ data }: Props) {
  if (!data?.sheets?.length) return <p>No data</p>;

  const sheet = data.sheets[0];
  const firstRow = sheet[0] || {};

  const labels = Object.keys(firstRow);

  // Convert all values to numbers, fallback to 0 if not a number
  const values: number[] = Object.values(firstRow).map((v) =>
    typeof v === 'number' ? v : Number(v) || 0
  );

  const chartData: ChartData<'pie'> = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: labels.map((_, i) => `hsl(${i * 60}, 70%, 50%)`),
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
  };

  return <Pie data={chartData} options={options} />;
}
