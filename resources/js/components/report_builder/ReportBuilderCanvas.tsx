// src/components/report_builder/ReportBuilderCanvas.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDrop, DropTargetMonitor } from "react-dnd";
import { Rnd } from "react-rnd";
import LineChart from "@/components/report_builder/widgets/LineChart";
import BarChart from "@/components/report_builder/widgets/BarChart";
import PieChart from "@/components/report_builder/widgets/PieChart";
import TableWidget from "@/components/report_builder/widgets/Table";

type WidgetType = "line-chart" | "bar-chart" | "pie-chart" | "table";

interface DroppedWidget {
  id: number;
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
}

interface CanvasProps {
  fileData?: any;
}

export default function ReportBuilderCanvas({ fileData }: CanvasProps) {
  const storageKey = fileData?.filename
    ? `report_builder_layout_v1_${fileData.filename}`
    : "report_builder_layout_v1";

  const [widgets, setWidgets] = useState<DroppedWidget[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw) as DroppedWidget[];
    } catch (e) {}
    return [];
  });

  // Dynamic container height for smooth expansion
  const [containerHeight, setContainerHeight] = useState(500);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const zCounterRef = useRef(1);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(widgets));
    } catch (e) {}
    // Update container height to fit all widgets
    const maxY = widgets.reduce((max, w) => Math.max(max, w.y + w.height), 0);
    if (maxY + 20 > containerHeight) setContainerHeight(maxY + 20);
  }, [widgets, storageKey, containerHeight]);

  const [{ isOver }, drop] = useDrop<{ type: string }, void, { isOver: boolean }>({
    accept: "WIDGET",
    drop: (item, monitor: DropTargetMonitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !containerRef.current) {
        addWidgetAt(20, 20, item.type as WidgetType);
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, clientOffset.x - rect.left);
      const y = Math.max(0, clientOffset.y - rect.top);
      addWidgetAt(x, y, item.type as WidgetType);
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  });

  const addWidgetAt = useCallback((x: number, y: number, type: WidgetType) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const defaultSize = { width: 360, height: 240 };
    const z = ++zCounterRef.current;
    setWidgets((prev) => [
      ...prev,
      { id, type, x, y, width: defaultSize.width, height: defaultSize.height, zIndex: z },
    ]);
    setContainerHeight((prev) => Math.max(prev, y + defaultSize.height + 20));
  }, []);

  const updateWidget = useCallback((id: number, patch: Partial<DroppedWidget>) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }, []);

  const removeWidget = useCallback((id: number) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const bringToFront = useCallback((id: number) => {
    const z = ++zCounterRef.current;
    updateWidget(id, { zIndex: z });
  }, [updateWidget]);

  const renderWidgetBody = useCallback(
    (w: DroppedWidget) => {
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
    },
    [fileData]
  );

  // Update container height smoothly as widget moves or resizes
  const handleDragOrResize = (x: number, y: number, w: number, h: number) => {
    const requiredHeight = y + h + 20;
    if (requiredHeight > containerHeight) {
      setContainerHeight(requiredHeight);
    }
  };

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        // @ts-ignore
        drop(node);
      }}
      className={`relative border-2 border-dashed rounded-md transition-colors ${
        isOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
      }`}
      style={{ minHeight: 500, height: containerHeight, overflowY: "auto", overflowX: "hidden" }}
    >
      {widgets.map((w) => (
        <Rnd
          key={w.id}
          size={{ width: w.width, height: w.height }}
          position={{ x: w.x, y: w.y }}
          onDrag={(e, d) => handleDragOrResize(d.x, d.y, w.width, w.height)}
          onDragStop={(_, d) => updateWidget(w.id, { x: Math.round(d.x), y: Math.round(d.y) })}
          onResize={(e, dir, ref, delta, pos) =>
            handleDragOrResize(pos.x, pos.y, ref.offsetWidth, ref.offsetHeight)
          }
          onResizeStop={(_, __, ref, ___, pos) =>
            updateWidget(w.id, {
              width: Math.max(60, ref.offsetWidth),
              height: Math.max(40, ref.offsetHeight),
              x: pos.x,
              y: pos.y,
            })
          }
          style={{
            zIndex: w.zIndex ?? 1,
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            borderRadius: 8,
            overflow: "hidden",
            background: "white",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
          minWidth={120}
          minHeight={80}
          enableUserSelectHack
        >
          <div
            style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative" }}
            onMouseDown={() => bringToFront(w.id)}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 8px",
                borderBottom: "1px solid rgba(0,0,0,0.04)",
                cursor: "move",
                background: "rgba(0,0,0,0.02)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600 }}>{w.type.replace("-", " ").toUpperCase()}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeWidget(w.id);
                }}
                style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 14, fontWeight: "bold", color: "#333", padding: 4 }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, width: "100%", height: "100%", padding: 8, boxSizing: "border-box" }}>
              {renderWidgetBody(w)}
            </div>
          </div>
        </Rnd>
      ))}

      {widgets.length === 0 && <p className="text-gray-400 text-center p-6">Drag widgets here</p>}
    </div>
  );
}
