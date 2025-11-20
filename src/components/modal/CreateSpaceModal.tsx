"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (space: any) => void;
}

export default function CreateSpaceModal({
  isOpen,
  onClose,
  onCreated,
}: CreateSpaceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [managerId, setManagerId] = useState("");
  const [users, setUsers] = useState([]);

  // Load managers only
  useEffect(() => {
    if (isOpen) {
      axios.get("http://localhost:5000/api/users").then((res) => {
        setUsers(res.data || []);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/spaces",
        {
          name,
          description,
          manager: managerId || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onCreated(response.data);
      onClose();
      resetForm();
    } catch (err) {
      console.error("Error creating space", err);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setManagerId("");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Create a new Space</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Space Name *
            </label>
            <input
              type="text"
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter space name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* MANAGER */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Manager
            </label>
            <select
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="">No manager</option>
              {users.map((u: any) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded-md p-2"
              placeholder="Describe this space"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
