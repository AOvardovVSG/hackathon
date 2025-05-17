'use client';

import { useState, useEffect } from 'react';
import { createLookup, updateLookup } from '../actions';

interface Lookup {
  id: string;
  name?: string;
  city?: string;
}

interface AdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'position' | 'department' | 'site';
  itemToEdit: Lookup | null;
  onSuccess: (item: Lookup) => void;
}

export default function AdminForm({ isOpen, onClose, type, itemToEdit, onSuccess }: AdminFormProps) {
  const [formData, setFormData] = useState<{ name?: string; city?: string }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name,
        city: itemToEdit.city
      });
    } else {
      setFormData({});
    }
  }, [itemToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isSite = type === 'site';
    const field = isSite ? 'city' : 'name';
    const value = isSite ? formData.city : formData.name;

    if (!value) {
      setError(`${isSite ? 'City' : 'Name'} is required`);
      return;
    }

    try {
      const data = { [field]: value };
      const result = itemToEdit
        ? await updateLookup(type, itemToEdit.id, data)
        : await createLookup(type, data);

      if (!result.success) {
        throw new Error(result.error);
      }

      onSuccess(result.data);
    } catch (error) {
      console.error(`Error ${itemToEdit ? 'updating' : 'creating'} ${type}:`, error);
      setError(`Failed to ${itemToEdit ? 'update' : 'create'} ${type}`);
    }
  };

  if (!isOpen) return null;

  const isSite = type === 'site';
  const fieldLabel = isSite ? 'City' : 'Name';

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {itemToEdit ? `Edit ${type}` : `Add ${type}`}
        </h3>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor={fieldLabel.toLowerCase()} className="block text-sm font-medium text-gray-700">
              {fieldLabel}
            </label>
            <input
              type="text"
              id={fieldLabel.toLowerCase()}
              value={isSite ? formData.city || '' : formData.name || ''}
              onChange={(e) => setFormData({ [fieldLabel.toLowerCase()]: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              placeholder={`Enter ${fieldLabel.toLowerCase()}`}
            />
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
            >
              {itemToEdit ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 