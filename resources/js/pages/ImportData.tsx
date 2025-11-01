import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Chart from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';

export default function ImportData({ files: initialFiles }) {
  const [files, setFiles] = useState(initialFiles || []);
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelData, setExcelData] = useState([]);

  const onDrop = (acceptedFiles) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    axios.post('/import-data/upload', formData).then((res) => {
      alert('File uploaded!');
      setFiles([...files, acceptedFiles[0].name]); // update local list
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] },
    multiple: false,
  });

  const loadFileData = (filename) => {
    axios.get(`/import-data/data/${filename}`).then((res) => {
      setExcelData(res.data);
    });
  };

  // Example: generate chart data
  const chartData = {
    labels: excelData.map((row) => row.Date || row[0]), // adjust depending on your Excel
    datasets: [
      {
        label: 'Value',
        data: excelData.map((row) => row.Value || row[1]), // adjust depending on your Excel
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <AppLayout>
      <Head title="Import Data" />
      <div className="p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4">Import Data</h1>

        {/* Drag & Drop */}
        <div {...getRootProps()} className={`border-2 border-dashed rounded-md p-8 text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
          <input {...getInputProps()} />
          {isDragActive ? <p>Drop the file here ...</p> : <p>Drag & drop an Excel file here, or click to select</p>}
        </div>

        {/* List uploaded files */}
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Saved Files</h2>
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file}>
                <button
                  className="text-blue-600 underline"
                  onClick={() => {
                    setSelectedFile(file);
                    loadFileData(file);
                  }}
                >
                  {file}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chart */}
        {excelData.length > 0 && (
          <div className="mt-6">
            <Line data={chartData} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
