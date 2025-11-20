"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

import TaskColumn from "./TaskColumn";
import TaskDetails from "./TaskDetails";

export interface Issue {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "in_review" | "done";
  priority: "low" | "medium" | "high";
}

export default function TaskBoard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  const columns = {
    todo: issues.filter((i) => i.status === "todo"),
    in_progress: issues.filter((i) => i.status === "in_progress"),
    in_review: issues.filter((i) => i.status === "in_review"),
    done: issues.filter((i) => i.status === "done"),
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/issues", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIssues(res.data);
    } catch (err: any) {
      toast.error("Failed to load issues");
    }
  };

  const deleteIssue = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Task deleted");
      fetchIssues();
    } catch {
      toast.error("Delete failed");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId as Issue["status"];

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/issues/${draggableId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Task moved!");
      fetchIssues();
    } catch {
      toast.error("Failed to move task");
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-5 w-full overflow-x-auto pb-4 snap-x snap-mandatory">
          <div className="flex gap-5 min-w-full md:min-w-0 md:grid md:grid-cols-4 md:gap-5">
            <TaskColumn
              title="To Do"
              columnId="todo"
              tasks={columns.todo}
              onDelete={deleteIssue}
              onOpenDetails={setOpenId}
            />
            <TaskColumn
              title="In Progress"
              columnId="in_progress"
              tasks={columns.in_progress}
              onDelete={deleteIssue}
              onOpenDetails={setOpenId}
            />
            <TaskColumn
              title="In Review"
              columnId="in_review"
              tasks={columns.in_review}
              onDelete={deleteIssue}
              onOpenDetails={setOpenId}
            />
            <TaskColumn
              title="Done"
              columnId="done"
              tasks={columns.done}
              onDelete={deleteIssue}
              onOpenDetails={setOpenId}
            />
          </div>
        </div>
      </DragDropContext>

     {openId && (
  <TaskDetails
    issueId={openId}
    onClose={() => setOpenId(null)}
    onUpdated={fetchIssues}
  />
)}

    </>
  );
}
