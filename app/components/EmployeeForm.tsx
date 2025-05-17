'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { createEmployee, updateEmployee } from '../actions';

interface Lookup {
  id: string;
  name: string;
  city?: string;
}

interface Employee {
  id: string;
  display_name: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
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

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  positions: Lookup[];
  departments: Lookup[];
  sites: Lookup[];
  employees: Employee[];
  employeeToEdit?: Employee;
}

export default function EmployeeForm({
  isOpen,
  onClose,
  onSuccess,
  positions,
  departments,
  sites,
  employees,
  employeeToEdit
}: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    displayName: '',
    email: '',
    positionId: '',
    address: '',
    siteId: '',
    managerId: '',
    employmentType: 'fullTime' as 'fullTime' | 'partTime',
    startDate: '',
    endDate: '',
    departmentId: '',
    picture: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (employeeToEdit) {
      const position = positions.find(p => p.id === employeeToEdit.position_id);
      const site = sites.find(s => s.id === employeeToEdit.site_id);
      const department = departments.find(d => d.id === employeeToEdit.department_id);

      setFormData({
        firstName: employeeToEdit.first_name,
        middleName: employeeToEdit.middle_name || '',
        lastName: employeeToEdit.last_name,
        displayName: employeeToEdit.display_name || '',
        email: employeeToEdit.email,
        positionId: position?.id || '',
        address: employeeToEdit.address,
        siteId: site?.id || '',
        managerId: employeeToEdit.manager_id || '',
        employmentType: employeeToEdit.employment_type,
        startDate: employeeToEdit.start_date,
        endDate: employeeToEdit.end_date || '',
        departmentId: department?.id || '',
        picture: null
      });

      if (employeeToEdit.picture_url) {
        setPreviewUrl(employeeToEdit.picture_url);
      }
    } else {
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        displayName: '',
        email: '',
        positionId: '',
        address: '',
        siteId: '',
        managerId: '',
        employmentType: 'fullTime',
        startDate: '',
        endDate: '',
        departmentId: '',
        picture: null
      });
      setPreviewUrl(null);
    }
  }, [employeeToEdit, positions, sites, departments]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, picture: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Find the selected position, site, and department IDs
      const position = positions.find(p => p.id === formData.positionId);
      const site = sites.find(s => s.id === formData.siteId);
      const department = departments.find(d => d.id === formData.departmentId);

      if (!position || !site || !department) {
        throw new Error('Please select valid position, site, and department');
      }

      const employeeData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        displayName: formData.displayName,
        email: formData.email,
        positionId: formData.positionId,
        address: formData.address,
        siteId: formData.siteId,
        managerId: formData.managerId || undefined,
        employmentType: formData.employmentType,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        departmentId: formData.departmentId
      };

      const result = employeeToEdit
        ? await updateEmployee({ ...employeeData, id: employeeToEdit.id })
        : await createEmployee(employeeData);

      if (!result.success) {
        throw new Error(result.error);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      // TODO: Show error message to user
    }
  };

  if (!isOpen) return null;

  // Filter out the current employee from manager options if editing
  const managerOptions = employees.filter(emp => !employeeToEdit || emp.id !== employeeToEdit.id);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {employeeToEdit ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              />
            </div>

            {/* Middle Name */}
            <div>
              <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                id="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              />
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                type="text"
                name="displayName"
                id="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              />
            </div>

            {/* Position */}
            <div>
              <label htmlFor="positionId" className="block text-sm font-medium text-gray-700">
                Position *
              </label>
              <select
                name="positionId"
                id="positionId"
                required
                value={formData.positionId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              >
                <option value="">Select a position</option>
                {positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>{pos.name}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              <textarea
                name="address"
                id="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              />
            </div>

            {/* Site */}
            <div>
              <label htmlFor="siteId" className="block text-sm font-medium text-gray-700">
                Site (City) *
              </label>
              <select
                name="siteId"
                id="siteId"
                required
                value={formData.siteId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              >
                <option value="">Select a site</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>{site.name || site.city}</option>
                ))}
              </select>
            </div>

            {/* Manager */}
            <div>
              <label htmlFor="managerId" className="block text-sm font-medium text-gray-700">
                Manager
              </label>
              <select
                name="managerId"
                id="managerId"
                value={formData.managerId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              >
                <option value="">No Manager</option>
                {managerOptions.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.display_name}</option>
                ))}
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
                Employment Type *
              </label>
              <select
                name="employmentType"
                id="employmentType"
                required
                value={formData.employmentType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              >
                <option value="fullTime">Full Time</option>
                <option value="partTime">Part Time</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
                Department *
              </label>
              <select
                name="departmentId"
                id="departmentId"
                required
                value={formData.departmentId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              >
                <option value="">Select a department</option>
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>{dep.name}</option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                required
                value={formData.startDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              />
            </div>

            {/* Picture Upload */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Picture</label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {previewUrl ? (
                    <div className="h-20 w-20 relative rounded-full overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No image</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 