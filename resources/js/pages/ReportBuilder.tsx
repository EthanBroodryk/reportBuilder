import React from "react";
import { usePage, Head } from "@inertiajs/react";
import ReportBuilderLayout from "@/layouts/report_builder/report-builder-layout";
import { type BreadcrumbItem } from "@/types";

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
    </ReportBuilderLayout>
  );
}
