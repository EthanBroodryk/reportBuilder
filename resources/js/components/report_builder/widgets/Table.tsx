import React from 'react';

interface Props {
  data?: any;
}

export default function Table({ data }: Props) {
  if (!data?.sheets?.length) return <p>No data</p>;

  const sheet = data.sheets[0];

  return (
    <table className="min-w-full border border-gray-300 text-sm">
      <thead className="bg-gray-50">
        <tr>
          {Object.keys(sheet[0] || {}).map((header) => (
            <th key={header} className="px-4 py-2 border-b border-gray-300 text-left text-gray-800">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sheet.map((row: any, idx: number) => (
          <tr key={idx} className="hover:bg-gray-50">
            {Object.values(row).map((value: any, i) => (
              <td key={i} className="px-4 py-2 border-b border-gray-200">
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
