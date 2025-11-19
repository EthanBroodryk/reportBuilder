import React from "react";
import { useDrag } from "react-dnd";
import type { NavItem } from "@/types";

interface DraggableWidgetItemProps {
  item: NavItem;
}

export default function DraggableWidgetItem({ item }: DraggableWidgetItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "WIDGET", // MUST match canvas accept
    item: { type: item.widget }, // payload
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const dragRef = (node: HTMLDivElement | null) => {
    if (node) drag(node);
  };

  return (
    <div
      ref={dragRef}
      className={`flex items-center gap-2 p-2 rounded cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {item.icon && <item.icon size={16} />}
      <span>{item.title}</span>
    </div>
  );
}
