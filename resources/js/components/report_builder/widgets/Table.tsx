import React, { useState, useMemo } from "react";

interface Props {
  data?: any;
  width?: number;
  height?: number;
}

export default function Table({ data, width = 300, height = 200 }: Props) {
  if (!data?.sheets?.length) return <div style={{ width, height }}>No data</div>;

  const sheetRaw: any[][] = data.sheets[0];
  if (!sheetRaw.length) return <div style={{ width, height }}>No data</div>;

  const headers = sheetRaw[0];
  const rows = sheetRaw.slice(1);
  console.log("rows", rows);

  const datasetNames = rows.map((_, i) => `Row ${i + 1}`);
  const [activeRows, setActiveRows] = useState<string[]>([...datasetNames]);

  const toggleRow = (name: string) => {
    setActiveRows((prev) =>
      prev.includes(name) ? prev.filter((r) => r !== name) : [...prev, name]
    );
  };

  const rowTotals = useMemo(() => {
    const result: Record<string, number> = {};
    rows.forEach((row, i) => {
      result[datasetNames[i]] = row.reduce((acc, val) => acc + Number(val ?? 0), 0);
    });
    return result;
  }, [rows, datasetNames]);

  const columnTotals = useMemo(() => {
    return headers.map((_, colIdx) =>
      rows.reduce((acc, row, rowIdx) => {
        const name = datasetNames[rowIdx];
        if (!activeRows.includes(name)) return acc;
        return acc + Number(row[colIdx] ?? 0);
      }, 0)
    );
  }, [rows, headers, datasetNames, activeRows]);

  return (
    <div style={{ width, height, overflowX: "auto" }}>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 4 }}>
        {datasetNames.map((name) => (
          <button
            key={name}
            onClick={() => toggleRow(name)}
            style={{
              padding: "2px 6px",
              fontSize: 12,
              cursor: "pointer",
              backgroundColor: activeRows.includes(name) ? "#e0e0e0" : "transparent",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          >
            {name}: {rowTotals[name].toLocaleString()}
          </button>
        ))}
      </div>

      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-2 border-b border-gray-300 text-left text-gray-800"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => {
            const name = datasetNames[i];
            if (!activeRows.includes(name)) return null;

            // Alternate row colors and highlight active rows
            const rowBg =
              i % 2 === 0
                ? activeRows.includes(name)
                  ? "#f0f7ff"
                  : "#f9f9f9"
                : activeRows.includes(name)
                ? "#d9efff"
                : "#ffffff";

            return (
              <tr key={i} style={{ backgroundColor: rowBg }}>
                {row.map((value, j) => (
                  <td
                    key={j}
                    className="px-4 py-2 border-b border-gray-200"
                    style={{ color: value == null ? "#999" : "#000" }}
                  >
                    {value != null ? value : 0}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>

        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            {columnTotals.map((total, idx) => (
              <td key={idx} className="px-4 py-2 border-t border-gray-300">
                {total}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
