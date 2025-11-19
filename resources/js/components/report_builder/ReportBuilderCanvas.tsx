import React, { useState, useCallback } from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import type { NavItem } from '@/types';
import LineChart from '@/components/report_builder/widgets/LineChart';
import BarChart from '@/components/report_builder/widgets/BarChart';
import PieChart from '@/components/report_builder/widgets/PieChart';
import TableWidget from '@/components/report_builder/widgets/Table';

type WidgetType = 'line-chart' | 'bar-chart' | 'pie-chart' | 'table';

interface DroppedWidget {
  id: number;
  type: WidgetType;
}

interface CanvasProps {
  fileData?: any;
}

export default function ReportBuilderCanvas({ fileData }: CanvasProps) {
  const [widgets, setWidgets] = useState<DroppedWidget[]>([]);
 
  const [{ isOver }, drop] = useDrop<{ type: string },void,{ isOver: boolean }>({
    accept: "WIDGET", 
    drop: (item) => {
      console.log("Dropped item:", item); 
        console.log("fileData:", fileData); 
      setWidgets((prev) => [
        ...prev,
        { id: Date.now(), type: item.type as WidgetType },
      ]);
    },

    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });


  const renderWidget = useCallback(
    (widget: DroppedWidget) => {
      switch (widget.type) {
        case 'line-chart':
          return <LineChart key={widget.id} data={fileData} />;
        case 'bar-chart':
          return <BarChart key={widget.id} data={fileData} />;
        case 'pie-chart':
          return <PieChart key={widget.id} data={fileData} />;
        case 'table':
          return <TableWidget key={widget.id} data={fileData} />;
        default:
          return null;
      }
    },
    [fileData]
  );

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>} 
      className={`min-h-[500px] border-2 border-dashed rounded-md p-4 transition-colors ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
      }`}
    >
      {widgets.map(renderWidget)}
      {widgets.length === 0 && (
        <p className="text-gray-400 text-center">Drag widgets here</p>
      )}
    </div>
  );
}
//////////////////////////////////////////////////////////////////////////////

