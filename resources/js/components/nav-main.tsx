import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { ChevronDown } from "lucide-react";
import type { NavItem } from "@/types";

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <NavMenuItem key={item.title} item={item} />
      ))}
    </SidebarMenu>
  );
}

function NavMenuItem({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = !!item.children?.length;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild={!hasChildren}
        onClick={hasChildren ? () => setIsOpen((o) => !o) : undefined}
      >
        {hasChildren ? (
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              {item.icon && <item.icon className="size-4 shrink-0" />}
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
            {item.icon && <item.icon className="size-4 shrink-0" />}
            <span className="truncate group-data-[collapsible=icon]:hidden">
              {item.title}
            </span>
          </Link>
        )}
      </SidebarMenuButton>

      {hasChildren && isOpen && (
        <SidebarMenuSub>
          {item.children.map((sub) => (
            <SidebarMenuSubItem key={sub.title}>
              <SidebarMenuSubButton asChild>
                {sub.children?.length ? (
                  // ✅ Recursive rendering for nested submenus
                  <NavMenuItem item={sub} />
                ) : (
                  <Link href={sub.href}>
                    {sub.icon && <sub.icon className="size-4 shrink-0" />}
                    <span className="truncate group-data-[collapsible=icon]:hidden">
                      {sub.title}
                    </span>
                  </Link>
                )}
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
