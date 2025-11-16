import ReportBuilderSidebarLayout from '@/layouts/report_builder/report-builder-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <ReportBuilderSidebarLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </ReportBuilderSidebarLayout>
);
