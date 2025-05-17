'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createGoal } from '../actions';

interface Employee {
  id: string;
  display_name: string;
}

interface Task {
  id: string;
  title: string;
  complete: boolean;
}

interface Goal {
  id: string;
  title: string;
  employee_id: string;
  timeframe: string;
  due_date: string;
  type: 'Personal' | 'Department' | 'Company';
  tasks: Task[];
  employee: Employee;
}

interface AdminGoalsTableProps {
  goals: Goal[];
  employees: Employee[];
  onGoalAdded: (goal: Goal) => void;
}

export default function AdminGoalsTable({
  goals,
  employees,
  onGoalAdded
}: AdminGoalsTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goal, setGoal] = useState({
    title: '',
    employeeId: '',
    timeframe: '',
    dueDate: '',
    type: 'Personal' as const,
    tasks: [{ title: '', complete: false }]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGoal(prev => ({ ...prev, [name]: value }));
  };

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...goal.tasks];
    newTasks[index] = { ...newTasks[index], title: value };
    setGoal(prev => ({ ...prev, tasks: newTasks }));
  };

  const addTask = () => {
    setGoal(prev => ({
      ...prev,
      tasks: [...prev.tasks, { title: '', complete: false }]
    }));
  };

  const removeTask = (index: number) => {
    setGoal(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: goal.title,
      employee_id: goal.employeeId,
      timeframe: goal.timeframe,
      due_date: goal.dueDate,
      type: goal.type,
      tasks: goal.tasks.map(task => ({
        title: task.title,
        complete: task.complete
      }))
    };

    const result = await createGoal(data);

    if (result.success && result.data) {
      onGoalAdded(result.data);
      setGoal({
        title: '',
        employeeId: '',
        timeframe: '',
        dueDate: '',
        type: 'Personal',
        tasks: [{ title: '', complete: false }]
      });
      setIsFormOpen(false);
    }
  };

  const handleClose = () => {
    setGoal({
      title: '',
      employeeId: '',
      timeframe: '',
      dueDate: '',
      type: 'Personal',
      tasks: [{ title: '', complete: false }]
    });
    setIsFormOpen(false);
  };

  const handleViewGoal = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleCloseView = () => {
    setSelectedGoal(null);
  };

  const getCompletionPercentage = (goal: Goal) => {
    if (goal.tasks.length === 0) return 0;
    const completedTasks = goal.tasks.filter(task => task.complete).length;
    return Math.round((completedTasks / goal.tasks.length) * 100);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Goals</h2>
          <p className="mt-2 text-sm text-gray-700">
            Manage goals and track their completion status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Goal
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto max-w-[2000px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completion
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {goals.map((goal) => (
              <tr
                key={goal.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewGoal(goal)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {goal.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {goal.employee.display_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{ width: `${getCompletionPercentage(goal)}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-gray-500">{getCompletionPercentage(goal)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(goal.due_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {goal.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Goal Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Goal
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
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={goal.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                />
              </div>

              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">
                  Employee *
                </label>
                <select
                  name="employeeId"
                  id="employeeId"
                  required
                  value={goal.employeeId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                >
                  <option value="">Select an employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.display_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
                  Timeframe *
                </label>
                <select
                  name="timeframe"
                  id="timeframe"
                  required
                  value={goal.timeframe}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                >
                  <option value="">Select a timeframe</option>
                  <option value="This Quarter">This Quarter</option>
                  <option value="This Year">This Year</option>
                  <option value="Next Quarter">Next Quarter</option>
                  <option value="Next Year">Next Year</option>
                </select>
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  required
                  value={goal.dueDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type *
                </label>
                <select
                  name="type"
                  id="type"
                  required
                  value={goal.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                >
                  <option value="Personal">Personal</option>
                  <option value="Department">Department</option>
                  <option value="Company">Company</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasks *
                </label>
                <div className="space-y-2">
                  {goal.tasks.map((task, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => handleTaskChange(index, e.target.value)}
                        placeholder="Task description"
                        required
                        className="flex-1 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTask}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    + Add Task
                  </button>
                </div>
              </div>

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

      {/* View Goal Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedGoal.title}
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
                  Goal Details
                </h3>
                <p className="text-sm text-gray-500">
                  Employee: {selectedGoal.employee.display_name}
                </p>
                <p className="text-sm text-gray-500">
                  Timeframe: {selectedGoal.timeframe}
                </p>
                <p className="text-sm text-gray-500">
                  Due Date: {new Date(selectedGoal.due_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  Type: {selectedGoal.type}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Tasks
                </h3>
                <div className="space-y-4">
                  {selectedGoal.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.complete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {task.complete ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 