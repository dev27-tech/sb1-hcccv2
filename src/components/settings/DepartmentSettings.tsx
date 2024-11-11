import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Plus, X, Save, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DepartmentSettings() {
  const [departments, setDepartments] = useState(['Development', 'Design', 'Marketing']);
  const [newDepartment, setNewDepartment] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      setDepartments([...departments, newDepartment.trim()]);
      setNewDepartment('');
      toast.success('Department added successfully');
    }
  };

  const handleRemoveDepartment = (index: number) => {
    setDepartments(departments.filter((_, i) => i !== index));
    toast.success('Department removed successfully');
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(departments[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (editValue.trim()) {
      const newDepartments = [...departments];
      newDepartments[index] = editValue.trim();
      setDepartments(newDepartments);
      setEditingIndex(null);
      toast.success('Department updated successfully');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Settings</h2>

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            placeholder="Add new department"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddDepartment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="space-y-2">
          {departments.map((department, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mr-2"
                />
              ) : (
                <span className="text-gray-700">{department}</span>
              )}
              
              <div className="flex items-center space-x-2">
                {editingIndex === index ? (
                  <button
                    onClick={() => handleSaveEdit(index)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Save className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(index)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => handleRemoveDepartment(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}