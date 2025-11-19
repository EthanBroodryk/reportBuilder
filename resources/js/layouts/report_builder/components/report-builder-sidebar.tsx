import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, BarChart3, LineChart, Table } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/layouts/report_builder/components/report-builder-navmain';
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
import { Link, router } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Upload, FileText } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import DraggableWidgetItem from '@/layouts/report_builder/components/DraggableWidgetItem';

// Fetch reports dynamically
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

  // Draggable widgets
  const widgetsSubmenu: NavItem[] = [
    { title: 'Pie Chart', icon: PieChart, draggable: true, widget: 'pie-chart' },
    { title: 'Bar Chart', icon: BarChart3, draggable: true, widget: 'bar-chart' },
    { title: 'Line Chart', icon: LineChart, draggable: true, widget: 'line-chart' },
    { title: 'Table', icon: Table, draggable: true, widget: 'table' },
  ];

  // Main nav items
  const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset">
      {/* Header / Logo */}
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

      {/* Sidebar content */}
      <SidebarContent className="space-y-4">
        {/* Render widgets as draggable items */}
        <div className="px-2">
          <h3 className="text-gray-500 uppercase text-xs mb-2">Widgets</h3>
          {widgetsSubmenu.map((widget) => (
            <DraggableWidgetItem key={widget.title} item={widget} />
          ))}
        </div>

        {/* Render normal nav items */}
        <NavMain items={mainNavItems} />

        {/* Render reports dynamically */}
        {reportsSubmenu.length > 0 && (
          <div className="px-2 mt-4">
            <h3 className="text-gray-500 uppercase text-xs mb-2">Reports</h3>
            <NavMain items={reportsSubmenu} />
          </div>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavFooter items={footerNavItems} className="mt-auto" />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
