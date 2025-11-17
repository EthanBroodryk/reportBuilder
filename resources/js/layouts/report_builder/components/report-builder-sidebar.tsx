import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, BarChart3, LineChart, Table } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/layouts/report_builder/components/report-builder-navmain';
// import {ReportBuilderSidebarHeader} from '@/layouts/report_builder/components/report-builder-sidebar-header'
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link,router } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Upload, FileText } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { reportBuilder } from '@/routes';






export async function getFiles(): Promise<NavItem[]> {
    try {
        const response = await axios.get('/api/reports');
        return response.data.map((file: any) => ({
            ...file,
            icon: FileText,
        }));
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
}

export function ReportBuilderSidebar() {
  
    const [reportsSubmenu, setReportsSubmenu] = useState<NavItem[]>([]);
    useEffect(() => {
    getFiles().then((files) => {
        const transformed = files.map((file) => ({
            ...file,
            onClick: () => {
                router.visit(`/report-builder?file=${encodeURIComponent(file.title)}`);
            },
            href: undefined, 
        }));
        setReportsSubmenu(transformed);
    });
}, []);




    const footerNavItems: NavItem[] = [
        { title: 'Repository', href: 'https://github.com/laravel/react-starter-kit', icon: Folder },
        { title: 'Documentation', href: 'https://laravel.com/docs/starter-kits#react', icon: BookOpen },
    ];


    const widgetsSubmenu: NavItem[] = [
        {
            title: 'Pie Chart',
            icon: PieChart,
            draggable: true,
            widget: 'pie-chart'
        },
        {
            title: 'Bar Chart',
            icon: BarChart3,
            draggable: true,
            widget: 'bar-chart'
        },
        {
            title: 'Line Chart',
            icon: LineChart,
            draggable: true,
            widget: 'line-chart'
        },
        {
            title: 'Table',
            icon: Table,
            draggable: true,
            widget: 'table'
        },
   ];

    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        {
            title: 'Widgets',
            href: reportBuilder(),
            icon: Upload,
            children: [
                {
                    title: "Select Widget",
                    icon: LayoutGrid,
                    children: widgetsSubmenu,
                }
            ]
        },
    ];


    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
