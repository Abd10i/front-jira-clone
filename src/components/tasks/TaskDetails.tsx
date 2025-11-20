"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

interface Props {
  issueId: string | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function TaskDetails({ issueId, onClose, onUpdated }: Props) {
  const [issue, setIssue] = useState<any>(null);

  // Local form state (no auto update)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!issueId) return;
    fetchIssue();
  }, [issueId]);

  const fetchIssue = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/issues/${issueId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setIssue(data);
      setTitle(data.title);
      setDescription(data.description || "");
      setStatus(data.status);
      setPriority(data.priority);
    } catch {
      toast.error("Failed to load issue");
    }
  };

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/issues/${issueId}`,
        { title, description, status, priority },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Changes saved!");
      onUpdated();
      onClose();
    } catch {
      toast.error("Update failed");
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: any) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!issueId || !issue) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white rounded-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-4">Task Details</h2>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="font-medium">Title</label>
            <input
              className="w-full border p-2 rounded mt-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-medium">Description</label>
            <textarea
              rows={4}
              className="w-full border p-2 rounded mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
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
          <div>
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

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded border"
            >
              Close
            </button>

            <button
              onClick={saveChanges}
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
