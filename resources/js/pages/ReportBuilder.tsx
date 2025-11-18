import React from "react";
import { usePage, Head } from "@inertiajs/react";
import ReportBuilderLayout from "@/layouts/report_builder/report-builder-layout";
import ReportBuilderCanvas from "@/components/report_builder/ReportBuilderCanvas";
import { type BreadcrumbItem } from "@/types";

// Import React DnD
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define the props expected from the server
interface ReportBuilderProps {
    fileData: {
        filename: string;
        sheets: any[];
    } | null;
}

export default function ReportBuilder() {
    // Cast props from Inertia to your interface
    const { fileData } = usePage().props as unknown as ReportBuilderProps;

    return (
        <ReportBuilderLayout
            breadcrumbs={
                [
                    { title: "Report Builder", href: "/report-builder" },
                    fileData?.filename ? { title: fileData.filename } : null,
                ].filter(Boolean) as BreadcrumbItem[]
            }
        >
            <Head title={`Report Builder${fileData?.filename ? ` - ${fileData.filename}` : ''}`} />

            {/* Wrap the canvas with DndProvider for drag & drop */}
            <DndProvider backend={HTML5Backend}>
                <ReportBuilderCanvas />
            </DndProvider>
        </ReportBuilderLayout>
    );
}
