'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import EmployeeTable from './EmployeeTable';
import EmployeeForm from './EmployeeForm';

interface Employee {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  display_name: string;
  email: string;
  position: string;
  address: string;
  site: string;
  manager?: string;
  employment_type: 'fullTime' | 'partTime';
  start_date: string;
  end_date?: string;
  department: string;
  picture_url?: string;
}

interface EmployeeManagementProps {
  initialEmployees: Employee[];
}

export default function EmployeeManagement({ initialEmployees }: EmployeeManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      console.error('Error refreshing employees:', err);
      setError('Failed to refresh employees. Please try again later.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Employee Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Employee
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

      <EmployeeTable employees={employees} />

      {isFormOpen && (
        <EmployeeForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
} 