import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import { Link,router } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Upload, FileText } from 'lucide-react';
import AppLogo from './app-logo';


// interface fileProps {

//     files:{
//         file:any[]
//     }

// }


export async function getFiles(): Promise<NavItem[]> {
    try {
        const response = await axios.get('/api/reports');
        console.log('target',response.data)
        return response.data.map((file: any) => ({
            ...file,
            icon: FileText,
        }));
        
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
}

export function AppSidebar() {
  
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


    const reportBuilderSubmenu: NavItem[] = [
        { title: 'Import Data', href: '/data', icon: Upload },
        {
            title: 'Reports',
            href: '#',
            icon: FileText,
            children: reportsSubmenu,
        },
    ];

    const mainNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        {
            title: 'Report Builder',
            href: '#',
            icon: Upload,
            children: reportBuilderSubmenu,
        },
    ];

    const footerNavItems: NavItem[] = [
        { title: 'Repository', href: 'https://github.com/laravel/react-starter-kit', icon: Folder },
        { title: 'Documentation', href: 'https://laravel.com/docs/starter-kits#react', icon: BookOpen },
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
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
