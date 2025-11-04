import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import type { NavItem } from "@/types";

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  // Track which submenu is open
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (title: string) => {
    setOpenItem((prev) => (prev === title ? null : title));
  };

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isOpen = openItem === item.title;
        const hasChildren = !!item.children?.length;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild={!hasChildren} // only use Link directly if no submenu
              onClick={
                hasChildren
                  ? () => toggleItem(item.title)
                  : undefined
              }
            >
              {hasChildren ? (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="size-4 shrink-0" />
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`size-4 transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              ) : (
                <Link href={item.href}>
                  <item.icon className="size-4 shrink-0" />
                  <span className="truncate group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </Link>
              )}
            </SidebarMenuButton>

            {/* Submenu */}
            {hasChildren && isOpen && (
              <SidebarMenuSub>
                {item.children.map((sub) => (
                  <SidebarMenuSubItem key={sub.title}>
                    <SidebarMenuSubButton asChild>
                      <Link href={sub.href}>
                        <sub.icon className="size-4 shrink-0" />
                        <span className="truncate group-data-[collapsible=icon]:hidden">
                          {sub.title}
                        </span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
