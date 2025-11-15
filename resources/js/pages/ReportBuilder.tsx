import React, { useState } from "react";
import { usePage, Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import axios from "axios";
import { PageProps as InertiaPageProps } from "@inertiajs/core";




export default function ReportBuilder() {
  return (
    <AppLayout>
      <Head title="Report Builder" />
    </AppLayout>
  );
}
