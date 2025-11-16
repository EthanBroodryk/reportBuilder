import React, { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import ReportBuilderLayout from "@/layouts/report_builder/report-builder-layout";
import axios from "axios";
import { PageProps as InertiaPageProps } from "@inertiajs/core";




export default function ReportBuilder() {
  return (
    <ReportBuilderLayout>
      <Head title="Report Builder" />
    </ReportBuilderLayout>
  );
}
