'use client';

import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import EmployeeTable from './EmployeeTable';
import EmployeeForm from './EmployeeForm';
import { createClient } from '@/utils/supabase/client';

interface Employee {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  display_name: string;
  email: string;
  position_id: string;
  address: string;
  site_id: string;
  manager_id?: string;
  employment_type: 'fullTime' | 'partTime';
  start_date: string;
  end_date?: string;
  department_id: string;
  picture_url?: string;
}

interface Lookup {
  id: string;
  name: string;
  city?: string;
}

interface EmployeeManagementProps {
  initialEmployees: Employee[];
  positions: Lookup[];
  departments: Lookup[];
  sites: Lookup[];
}

export default function EmployeeManagement({ initialEmployees, positions, departments, sites }: EmployeeManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = async () => {
    const supabase = createClient();
    try {
      const { data: newEmployees, error } = await supabase
        .from('employees')
        .select('*')
        .order('first_name', { ascending: true });

      if (error) throw error;
      setEmployees(newEmployees || []);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error refreshing employees:', error);
      setError('Failed to refresh employee list');
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

      <EmployeeTable
        employees={employees}
        positions={positions}
        departments={departments}
        sites={sites}
      />

      {isFormOpen && (
        <EmployeeForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleSuccess}
          positions={positions}
          departments={departments}
          sites={sites}
          employees={employees}
        />
      )}
    </div>
  );
} 