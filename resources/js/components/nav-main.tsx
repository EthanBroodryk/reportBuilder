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
        <NavMenuItem key={item.title} item={item} isSubItem={false} />
      ))}
    </SidebarMenu>
  );
}

function NavMenuItem({ item, isSubItem }: { item: NavItem; isSubItem: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = !!item.children?.length;

  const Content = (
    <>
      {item.icon && <item.icon className="size-4 shrink-0" />}
      <span className="truncate group-data-[collapsible=icon]:hidden">
        {item.title}
      </span>
    </>
  );

  // 🔹 Use SidebarMenuItem for top-level items only
  const Wrapper = isSubItem ? SidebarMenuSubItem : SidebarMenuItem;
  const Button = isSubItem ? SidebarMenuSubButton : SidebarMenuButton;

  return (
    <Wrapper>
      <Button
        asChild={!hasChildren}
        onClick={hasChildren ? () => setIsOpen((o) => !o) : undefined}
      >
        {hasChildren ? (
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">{Content}</div>
            <ChevronDown
              className={`size-4 transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        ) : (
          <Link href={item.href}>{Content}</Link>
        )}
      </Button>

      {hasChildren && isOpen && (
        <SidebarMenuSub>
          {item.children?.map((sub) => (
            <NavMenuItem key={sub.title} item={sub} isSubItem={true} />
          ))}
        </SidebarMenuSub>
      )}
    </Wrapper>
  );
}
