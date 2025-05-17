'use client';

import { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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

interface EmployeeTableProps {
  employees: Employee[];
  positions: Lookup[];
  departments: Lookup[];
  sites: Lookup[];
}

export default function EmployeeTable({ employees, positions, departments, sites }: EmployeeTableProps) {
  const [sortField, setSortField] = useState<keyof Employee>('first_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Employee) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === undefined || bValue === undefined) return 0;
    if (aValue === null || bValue === null) return 0;

    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="overflow-x-auto max-w-[2000px]">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Picture
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('first_name')}
            >
              First Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('middle_name')}
            >
              Middle Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('last_name')}
            >
              Last Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('display_name')}
            >
              Display Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('email')}
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('position_id')}
            >
              Position
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('site_id')}
            >
              Site
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('manager_id')}
            >
              Manager
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('employment_type')}
            >
              Employment Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('start_date')}
            >
              Start Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('end_date')}
            >
              End Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('department_id')}
            >
              Department
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedEmployees.map((employee) => {
            const position = positions.find(p => p.id === employee.position_id);
            const site = sites.find(s => s.id === employee.site_id);
            const department = departments.find(d => d.id === employee.department_id);
            const manager = employees.find(e => e.id === employee.manager_id);
            return (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {employee.first_name[0]}{employee.last_name[0]}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.first_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.middle_name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.last_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.display_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{position ? position.name : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{site ? site.city : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{manager ? manager.display_name : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${employee.employment_type === 'fullTime' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {employee.employment_type === 'fullTime' ? 'Full Time' : 'Part Time'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(employee.start_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(employee.end_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{department ? department.name : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 