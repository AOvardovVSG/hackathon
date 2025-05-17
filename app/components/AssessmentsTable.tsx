'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createAssessment } from '../actions';
import MultiSelect from './MultiSelect';

interface Form {
  id: string;
  name: string;
  questions: string[];
}

interface Employee {
  id: string;
  display_name: string;
}

interface Assessment {
  id: string;
  form_id: string;
  employee_ids: string[];
  completed_employee_ids: string[];
  form?: Form;
}

interface AssessmentsTableProps {
  assessments: Assessment[];
  forms: Form[];
  employees: Employee[];
  onAssessmentAdded: (assessment: Assessment) => void;
}

export default function AssessmentsTable({
  assessments,
  forms,
  employees,
  onAssessmentAdded
}: AssessmentsTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [assessment, setAssessment] = useState({
    formId: '',
    employeeIds: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAssessment(prev => ({ ...prev, [name]: value }));
  };

  const handleEmployeesChange = (selectedEmployees: string[]) => {
    setAssessment(prev => ({ ...prev, employeeIds: selectedEmployees }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      form_id: assessment.formId,
      employee_ids: assessment.employeeIds
    };

    const result = await createAssessment(data);

    if (result.success && result.data) {
      onAssessmentAdded(result.data);
      setAssessment({ formId: '', employeeIds: [] });
      setIsFormOpen(false);
    }
  };

  const handleClose = () => {
    setAssessment({ formId: '', employeeIds: [] });
    setIsFormOpen(false);
  };

  const handleViewAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
  };

  const handleCloseView = () => {
    setSelectedAssessment(null);
  };

  const employeeOptions = employees.map(employee => ({
    id: employee.id,
    label: employee.display_name
  }));

  const isCompleted = (assessment: Assessment) => {
    return assessment.employee_ids.length > 0 &&
      assessment.employee_ids.length === assessment.completed_employee_ids.length &&
      assessment.employee_ids.every(id => assessment.completed_employee_ids.includes(id));
  };

  const getEmployeeStatus = (employeeId: string, assessment: Assessment) => {
    return assessment.completed_employee_ids.includes(employeeId) ? 'Completed' : 'Not Started';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Assessments</h2>
          <p className="mt-2 text-sm text-gray-700">
            Manage assessments and track their completion status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Assessment
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto max-w-[2000px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Form
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employees
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assessments.map((assessment) => (
              <tr
                key={assessment.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewAssessment(assessment)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {assessment.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {assessment.form?.name || 'Unknown Form'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {assessment.employee_ids.length} employees
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCompleted(assessment)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {isCompleted(assessment) ? 'Completed' : 'In Progress'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Assessment Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Assessment
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="formId" className="block text-sm font-medium text-gray-700">
                  Form *
                </label>
                <select
                  name="formId"
                  id="formId"
                  required
                  value={assessment.formId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                >
                  <option value="">Select a form</option>
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>{form.name}</option>
                  ))}
                </select>
              </div>

              <MultiSelect
                label="Employees"
                options={employeeOptions}
                value={assessment.employeeIds}
                onChange={handleEmployeesChange}
                required
                placeholder="Select employees..."
              />

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleClose}
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
      )}

      {/* View Assessment Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedAssessment.form?.name || 'Unknown Form'}
              </h2>
              <button
                onClick={handleCloseView}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Assessment Details
                </h3>
                <p className="text-sm text-gray-500">
                  ID: {selectedAssessment.id}
                </p>
                <p className="text-sm text-gray-500">
                  Total Employees: {selectedAssessment.employee_ids.length}
                </p>
                <p className="text-sm text-gray-500">
                  Completed: {selectedAssessment.completed_employee_ids.length}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Employee Status
                </h3>
                <div className="space-y-4">
                  {selectedAssessment.employee_ids.map((employeeId) => {
                    const employee = employees.find(e => e.id === employeeId);
                    const status = getEmployeeStatus(employeeId, selectedAssessment);
                    return (
                      <div key={employeeId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{employee?.display_name || 'Unknown Employee'}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 