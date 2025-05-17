'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { updateTask } from '../actions';

interface Task {
  id: string;
  title: string;
  complete: boolean;
  updated_at: string;
}

interface Goal {
  id: string;
  title: string;
  employee_id: string;
  timeframe: string;
  due_date: string;
  type: 'Personal' | 'Department' | 'Company';
  tasks: Task[];
  employee: {
    display_name: string;
  };
}

interface UserGoalsTableProps {
  goals: Goal[];
}

export default function UserGoalsTable({ goals: initialGoals }: UserGoalsTableProps) {
  const [goals, setGoals] = useState(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleViewGoal = (goal: Goal) => {
    setSelectedGoal(goal);
  };

  const handleCloseView = () => {
    setSelectedGoal(null);
  };

  const handleTaskToggle = async (taskId: string, currentStatus: boolean) => {
    const result = await updateTask(taskId, !currentStatus);
    if (result.success) {
      // Update both the selected goal and the goals list
      const updatedTask = { ...result.data, complete: !currentStatus };

      setSelectedGoal(prev => {
        if (!prev) return null;
        return {
          ...prev,
          tasks: prev.tasks.map(task =>
            task.id === taskId ? updatedTask : task
          )
        };
      });

      setGoals(prev => prev.map(goal => {
        if (goal.id === selectedGoal?.id) {
          return {
            ...goal,
            tasks: goal.tasks.map(task =>
              task.id === taskId ? updatedTask : task
            )
          };
        }
        return goal;
      }));
    }
  };

  const getCompletionPercentage = (goal: Goal) => {
    if (goal.tasks.length === 0) return 0;
    const completedTasks = goal.tasks.filter(task => task.complete).length;
    return Math.round((completedTasks / goal.tasks.length) * 100);
  };

  const getLastCheckIn = (goal: Goal) => {
    if (!goal.tasks.length) return null;
    const dates = goal.tasks
      .filter(task => task.complete)
      .map(task => new Date(task.updated_at).getTime());
    if (!dates.length) return null;
    return new Date(Math.max(...dates));
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">My Goals</h2>
          <p className="mt-2 text-sm text-gray-700">
            View and update your goals and tasks.
          </p>
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
                Completion
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Check-in
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
                  {new Date(goal.due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {goal.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getLastCheckIn(goal)?.toLocaleString() || 'No check-ins yet'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                  Timeframe: {selectedGoal.timeframe}
                </p>
                <p className="text-sm text-gray-500">
                  Due Date: {new Date(selectedGoal.due_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Type: {selectedGoal.type}
                </p>
                <p className="text-sm text-gray-500">
                  Last Check-in: {getLastCheckIn(selectedGoal)?.toLocaleString() || 'No check-ins yet'}
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
                        {task.complete && (
                          <p className="text-xs text-gray-500 mt-1">
                            Completed on {new Date(task.updated_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskToggle(task.id, task.complete);
                        }}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.complete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {task.complete ? 'Completed' : 'Mark Complete'}
                      </button>
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