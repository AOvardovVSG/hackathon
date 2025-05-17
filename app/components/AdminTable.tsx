'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AdminForm from './AdminForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { deleteLookup } from '../actions';

interface Lookup {
  id: string;
  name?: string;
  city?: string;
}

interface AdminTableProps {
  data: Lookup[];
  setData: (data: Lookup[]) => void;
  type: 'position' | 'department' | 'site';
  displayField: 'name' | 'city';
}

export default function AdminTable({ data, setData, type, displayField }: AdminTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Lookup | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Lookup | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (item: Lookup) => {
    setItemToEdit(item);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    const result = await deleteLookup(type, itemToDelete.id);

    if (!result.success) {
      setError(result.error || 'Failed to delete item');
      return;
    }

    setData(data.filter(item => item.id !== itemToDelete.id));
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 capitalize">{type}s</h2>
        <button
          onClick={() => {
            setItemToEdit(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add {type}
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {displayField === 'name' ? 'Name' : 'City'}
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {displayField === 'name' ? item.name : item.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setItemToDelete(item)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <AdminForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setItemToEdit(null);
          }}
          type={type}
          itemToEdit={itemToEdit}
          onSuccess={(newItem: Lookup) => {
            if (itemToEdit) {
              setData(data.map(item => item.id === newItem.id ? newItem : item));
            } else {
              setData([...data, newItem]);
            }
            setIsFormOpen(false);
            setItemToEdit(null);
          }}
        />
      )}

      <DeleteConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        employeeName={itemToDelete ? (displayField === 'city' ? itemToDelete.city : itemToDelete.name) || '' : ''}
      />
    </div>
  );
} 