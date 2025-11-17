// ReportBuilder.tsx
import React from "react";
import { usePage, Head } from "@inertiajs/react";
import ReportBuilderLayout from "@/layouts/report_builder/report-builder-layout";
import ReportBuilderCanvas from "@/components/report_builder/ReportBuilderCanvas";
import { type BreadcrumbItem } from "@/types";

// Import React DnD
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function ReportBuilder() {
    const file = new URLSearchParams(window.location.search).get("file");

    return (
        <ReportBuilderLayout
            breadcrumbs={
                [
                    { title: "Report Builder", href: "/report-builder" },
                    file ? { title: decodeURIComponent(file) } : null,
                ].filter(Boolean) as BreadcrumbItem[]
            }
        >
            <Head title="Report Builder" />
            {/* Wrap the canvas with DndProvider */}
            <DndProvider backend={HTML5Backend}>
                <ReportBuilderCanvas />
            </DndProvider>
        </ReportBuilderLayout>
    );
}
