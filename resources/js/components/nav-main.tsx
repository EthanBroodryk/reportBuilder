import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  const { url } = usePage();

  return (
    <nav className="space-y-1">
      {items.map((item, index) => (
        <div key={index}>
          {/* If this item has children, render as collapsible */}
          {item.children ? (
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
                <div className="flex items-center space-x-2">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-70" />
              </CollapsibleTrigger>

              <CollapsibleContent className="pl-6 mt-1 space-y-1">
                {item.children.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    href={child.href}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                      url === child.href && 'bg-gray-200 dark:bg-gray-900 font-semibold'
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      {child.icon && <child.icon className="h-4 w-4" />}
                      <span>{child.title}</span>
                    </div>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <Link
              href={item.href}
              className={cn(
                'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800',
                url === item.href && 'bg-gray-200 dark:bg-gray-900 font-semibold'
              )}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.title}</span>
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
