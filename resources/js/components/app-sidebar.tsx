import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
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
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Upload, FileText, BarChart3} from 'lucide-react';
import AppLogo from './app-logo';


const reportsSubmenu: NavItem[] = [
    { title: 'Sales Report', href: '/reports/sales', icon: BarChart3 },
    { title: 'Finance Report', href: '/reports/finance', icon: FileText },
    { title: 'Active Loans Report', href: '/reports/loans', icon: FileText },
];

const reportBuilderSubmenu: NavItem[] = [
    { title: 'Import Data', href: '/data', icon: Upload },
    { title: 'Build Report', href: '/report-builder/build', icon: LayoutGrid },
    { 
        title: 'Reports', 
        href: '#', 
        icon: FileText,
        children: reportsSubmenu, 
    },
];



const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Report Builder',
        href: '#',
        icon: Upload,
        children: reportBuilderSubmenu, 
    },
];

// ✅ Footer navigation items
const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
                {/* ✅ Renders main navigation including submenu */}
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
