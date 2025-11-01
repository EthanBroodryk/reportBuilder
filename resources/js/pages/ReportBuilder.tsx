import React, { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import axios from "axios";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

// ✅ Extend Inertia's built-in PageProps
interface PageProps extends InertiaPageProps {
  files: {
    name: string;
    url: string;
  }[];
}

export default function ReportBuilder() {
  const { files } = usePage<PageProps>().props;
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/report-builder/upload", formData);
      alert("File uploaded successfully");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AppLayout>
      <Head title="Report Builder" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Report Builder</h1>

        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        {uploading && <p>Uploading...</p>}

        <h2 className="text-xl mt-6 mb-2">Uploaded Files</h2>
        <ul className="list-disc pl-5">
          {files.map((file, i) => (
            <li key={i}>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {file.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
