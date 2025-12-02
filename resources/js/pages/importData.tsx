import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import type { BreadcrumbItem } from '@/types';

type ImportDataProps = {
  files?: string[];
};

export default function ImportData({ files: initialFiles }: ImportDataProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [excelData, setExcelData] = useState<Array<Record<string, any>>>([]);
  const [columnRoles, setColumnRoles] = useState<Record<string, 'category' | 'value' | ''>>({});

  // Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Report Builder", href: "/report-builder" },
    { title: "Import Data", href: "/report-builder/import" }
  ];

  // Handle file upload / drop
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    axios.post('/data/import-data/upload', formData)
      .then(() => {
        alert('File uploaded!');
        setSelectedFile(file.name);
        loadFileData(file.name);
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  // Load content of selected file
  const loadFileData = (filename: string) => {
    axios.get(`/data/import-data/data/${filename}`).then((res) => {
      setExcelData(res.data);
    });
  };

  // Initialize column roles when data loads
  useEffect(() => {
    if (excelData.length > 0) {
      const headers = Object.keys(excelData[0]);
      const defaultRoles = Object.fromEntries(headers.map(h => [h, '' as '' ]));
      setColumnRoles(defaultRoles);
    }
  }, [excelData]);

  // Handle select change
const handleRoleChange = (column: string, role: 'category' | 'value' | '') => {
  if (role === 'category') {
    const updated = Object.fromEntries(
      Object.keys(columnRoles).map(h => [
        h, 
        (h === column ? 'category' : (columnRoles[h] === 'category' ? '' : columnRoles[h]))
      ])
    ) as Record<string, '' | 'category' | 'value'>; // <-- cast here

    setColumnRoles(updated);
  } else {
    setColumnRoles({
      ...columnRoles,
      [column]: role
    });
  }
};


  // Final save
  const handleSaveMapping = () => {
    const categoryColumn = Object.keys(columnRoles).find(col => columnRoles[col] === 'category');
    const valueColumns = Object.keys(columnRoles).filter(col => columnRoles[col] === 'value');

    if (!categoryColumn) {
      alert("Please select a Category column.");
      return;
    }

    if (valueColumns.length === 0) {
      alert("Please select at least one Value column.");
      return;
    }

    const mapping = {
      file: selectedFile,
      categoryColumn,
      valueColumns
    };

    console.log("Saved Mapping:", mapping);
    alert("Mapping saved!");
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Import Data" />

      <div className="p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4">Import Data</h1>

        {/* Drag & Drop */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-8 text-center ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? <p>Drop the file here ...</p> : <p>Drag & drop an Excel file here, or click to select</p>}
        </div>

        {/* Column Role Selector */}
        {excelData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Assign Column Roles</h3>

            {Object.keys(columnRoles).map((header) => (
              <div key={header} className="flex items-center gap-4 mb-2">
                <span className="w-40">{header}</span>

                <select
                  className="border p-1 rounded"
                  value={columnRoles[header]}
                  onChange={(e) => handleRoleChange(header, e.target.value as any)}
                >
                  <option value="">-- Select Role --</option>
                  <option value="category">Category / Dimension</option>
                  <option value="value">Value / Measure</option>
                </select>
              </div>
            ))}

            <button
              onClick={handleSaveMapping}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Mapping
            </button>
          </div>
        )}

        {/* Excel Table */}
        {excelData.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-2">Data from: {selectedFile}</h3>

            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(excelData[0]).map((header) => (
                    <th key={header} className="px-4 py-2 border-b text-left text-gray-800">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-4 py-2 border-b">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
