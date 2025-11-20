"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (issue: any) => void;
}

export default function CreateTaskModal({ isOpen, onClose, onCreated }: Props) {
  const [defaultSpace, setDefaultSpace] = useState<any>(null);
  const [employees, setEmployees] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [assignee, setAssignee] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [user, setUser] = useState<any>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Safe user load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchDefaultSpace();
      fetchEmployees();
    }
  }, [isOpen, user]);

  const fetchDefaultSpace = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/spaces/default", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDefaultSpace(res.data);
      setProject(res.data._id);
    } catch {
      toast.error("Failed to load workspace");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:3000/employees");
      let list = res.data;

      // Employees can only assign themselves
      if (user?.role === "employee") {
        list = list.filter((e: any) => e.user === user._id);
        setAssignee(list[0]?._id);
      }

      setEmployees(list);
    } catch {
      toast.error("Failed to load employees");
    }
  };

  const createIssue = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:3000/issues",
        { title, description, project, assignee, status, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Issue created!");
      onCreated(res.data);
      onClose();
    } catch {
      toast.error("Failed to create task");
    }
  };

  // Click outside closes modal
  useEffect(() => {
    const handler = (e: any) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000]">
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white rounded-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-5">Create Task</h2>

        {/* Workspace */}
        <div className="mb-4">
          <label className="font-medium">Workspace</label>
          <select
            className="w-full border p-2 rounded mt-1 bg-gray-200"
            value={project}
            onChange={() => {}}
          >
            {defaultSpace && (
              <option value={defaultSpace._id}>{defaultSpace.name}</option>
            )}
          </select>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="font-medium">Status</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="font-medium">Priority</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Assignee */}
        <div className="mb-4">
          <label className="font-medium">Assign To</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">Unassigned</option>

            {employees.map((emp: any) => (
              <option key={emp._id} value={emp._id}>
                {emp.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="font-medium">Title</label>
          <input
            className="w-full border p-2 rounded mt-1"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="font-medium">Description</label>
          <textarea
            className="w-full border p-2 rounded mt-1"
            rows={4}
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            onClick={createIssue}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
