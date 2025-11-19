// src/components/report_builder/ReportBuilderCanvas.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { Rnd } from "react-rnd";
import type { NavItem } from "@/types";
import LineChart from "@/components/report_builder/widgets/LineChart";
import BarChart from "@/components/report_builder/widgets/BarChart";
import PieChart from "@/components/report_builder/widgets/PieChart";
import TableWidget from "@/components/report_builder/widgets/Table";

type WidgetType = "line-chart" | "bar-chart" | "pie-chart" | "table";

interface DroppedWidget {
  id: number;
  type: WidgetType;
  x: number; // px from left of canvas
  y: number; // px from top of canvas
  width: number;
  height: number;
  zIndex?: number;
}

interface CanvasProps {
  fileData?: any;
}

const STORAGE_KEY = "report_builder_layout_v1";

export default function ReportBuilderCanvas({ fileData }: CanvasProps) {
  const [widgets, setWidgets] = useState<DroppedWidget[]>(() => {
    // try to restore from localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as DroppedWidget[];
    } catch (e) { /* ignore */ }
    return [];
  });

  // used to compute drop coordinates relative to canvas
  const containerRef = useRef<HTMLDivElement | null>(null);

  // track next zIndex
  const zCounterRef = useRef<number>(1);

  // Persist layout
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    } catch (e) {
      // ignore storage errors
    }
  }, [widgets]);

  // React-DnD drop handling
  const [{ isOver }, drop] = useDrop<{ type: string }, void, { isOver: boolean }>({
    accept: "WIDGET",
    drop: (item, monitor: DropTargetMonitor) => {
      // get client coords and convert to canvas local coords
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !containerRef.current) {
        // fallback: append in top-left corner
        addWidgetAt(20, 20, item.type as WidgetType);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      // clamp the position inside the canvas
      const x = Math.max(0, clientOffset.x - rect.left);
      const y = Math.max(0, clientOffset.y - rect.top);

      addWidgetAt(x, y, item.type as WidgetType);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // helper to add with default size and zIndex
  const addWidgetAt = useCallback((x: number, y: number, type: WidgetType) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const defaultSize = { width: 360, height: 240 }; // tweak defaults here

    const z = ++zCounterRef.current;

    setWidgets((prev) => [
      ...prev,
      {
        id,
        type,
        x,
        y,
        width: defaultSize.width,
        height: defaultSize.height,
        zIndex: z,
      },
    ]);
  }, []);

  // helper to update one widget
  const updateWidget = useCallback((id: number, patch: Partial<DroppedWidget>) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }, []);

  // remove a widget
  const removeWidget = useCallback((id: number) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // bring widget to front (update zIndex)
  const bringToFront = useCallback((id: number) => {
    const z = ++zCounterRef.current;
    updateWidget(id, { zIndex: z });
  }, [updateWidget]);

  // render a widget body (chart or table)
  const renderWidgetBody = useCallback((w: DroppedWidget) => {
    const commonProps = { data: fileData, width: w.width, height: w.height };
    switch (w.type) {
      case "line-chart":
        return <LineChart key={w.id} {...commonProps} />;
      case "bar-chart":
        return <BarChart key={w.id} {...commonProps} />;
      case "pie-chart":
        return <PieChart key={w.id} {...commonProps} />;
      case "table":
        return <TableWidget key={w.id} {...commonProps} />;
      default:
        return null;
    }
  }, [fileData]);

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        // attach react-dnd drop ref to the same container
        // typed cast because react-dnd's drop expects Ref<HTMLDivElement>
        // @ts-ignore
        drop(node);
      }}
      className={`relative min-h-[500px] border-2 border-dashed rounded-md p-0 transition-colors ${
        isOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
      }`}
      style={{ overflow: "hidden" }}
    >
      {/* render widgets as Rnd (draggable + resizable) */}
      {widgets.map((w) => (
        <Rnd
          key={w.id}
          size={{ width: w.width, height: w.height }}
          position={{ x: w.x, y: w.y }}
          bounds="parent"
          onDragStart={() => bringToFront(w.id)}
          onResizeStart={() => bringToFront(w.id)}
          onDragStop={(_, d) => {
            // d.x/d.y are the new positions
            updateWidget(w.id, { x: Math.max(0, Math.round(d.x)), y: Math.max(0, Math.round(d.y)) });
          }}
          onResizeStop={(_, __, ref, ____, delta) => {
            // ref is the DOM element of the content; use offsetWidth/Height
            const width = Math.max(60, ref.offsetWidth);
            const height = Math.max(40, ref.offsetHeight);
            updateWidget(w.id, { width, height });
          }}
          style={{
            zIndex: w.zIndex ?? 1,
            // small drop shadow and border for a nice widget look
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            borderRadius: 8,
            overflow: "hidden",
            background: "white",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
          minWidth={120}
          minHeight={80}
          enableUserSelectHack={true}
        >
          {/* Widget header (drag handle + actions) */}
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
            onMouseDown={() => bringToFront(w.id)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 8px",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                cursor: "move", // users see draggable header
                background: "rgba(0,0,0,0.02)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600 }}>
                {w.type.replace("-", " ").toUpperCase()}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWidget(w.id);
                  }}
                  title="Remove"
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 4,
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* content area (chart/table) */}
            <div style={{ flex: 1, width: "100%", height: "100%", padding: 8, boxSizing: "border-box" }}>
              {renderWidgetBody(w)}
            </div>
          </div>
        </Rnd>
      ))}

      {/* empty state message */}
      {widgets.length === 0 && (
        <p className="text-gray-400 text-center p-6">Drag widgets here</p>
      )}
    </div>
  );
}
