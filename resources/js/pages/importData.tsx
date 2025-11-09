import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';




export default function ImportData({ files: initialFiles }) {

  
  const [files, setFiles] = useState(initialFiles || []);
  const [selectedFile, setSelectedFile] = useState(null);
  const [excelData, setExcelData] = useState([]);

  const onDrop = (acceptedFiles) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    axios.post('/data/import-data/upload', formData)
    .then((res) => {
      alert('File uploaded!');
      setFiles([...files, acceptedFiles[0].name]);
    });

  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] },
    multiple: false,
  });

  const loadFileData = (filename) => {
    axios.get(`/data/import-data/data/${filename}`).then((res) => {
      setExcelData(res.data);
    });
  };


  return (
  <AppLayout>
    <Head title="Import Data" />
    <div className="p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-4">Import Data</h1>

      {/* Drag & Drop */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-8 text-center ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : (
          <p>Drag & drop an Excel file here, or click to select</p>
        )}
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

      {/* 🧾 Display Excel Data as Table */}
      {excelData.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2">
            Data from: {selectedFile}
          </h3>

          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(excelData[0]).map((header) => (
                  <th key={header}  className="px-4 py-2 border-b border-gray-300 text-left text-gray-800">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="px-4 py-2 border-b border-gray-200">
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
