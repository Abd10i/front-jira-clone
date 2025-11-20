"use client";

import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Trash2, User2 } from "lucide-react";
import type { Issue } from "./TaskBoard";

interface Props {
  title: string;
  columnId: string;
  tasks: Issue[];
  onDelete: (id: string) => void;
  onOpenDetails: (id: string) => void;   // <-- REQUIRED
}

const priorityColors: Record<string, string> = {
  low: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  high: "bg-red-100 text-red-700 border-red-300",
};

export default function TaskColumn({
  title,
  columnId,
  tasks,
  onDelete,
  onOpenDetails,
}: Props) {
  return (
    <div className="w-[260px] md:w-auto snap-start bg-[#F4F5F7] rounded-lg p-4 shadow-sm flex-shrink-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-gray-700 uppercase">{title}</h3>
        <span className="px-2 py-0.5 text-xs bg-gray-300 rounded-full">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-3 min-h-[200px]"
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onOpenDetails(task._id)}   // <-- MODAL OPENS
                    className="w-full bg-white p-4 rounded-md border border-gray-200
                               shadow-sm hover:shadow-md transition cursor-pointer relative"
                  >
                    {/* Title */}
                    <div className="font-semibold text-gray-800">
                      {task.title}
                    </div>

                    {/* Description */}
                    {task.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-3">
                      <div
                        className={`px-2 py-0.5 text-xs rounded-md border ${priorityColors[task.priority]}`}
                      >
                        {task.priority}
                      </div>

                      <div className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center">
                        <User2 size={14} className="text-blue-700" />
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent modal opening
                        onDelete(task._id);
                      }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
