'use client';

type Goal = {
  id: string;
  title: string;
  due_date: string;
  type: 'Personal' | 'Department' | 'Company';
  tasks: {
    id: string;
    complete: boolean;
    updated_at: string;
  }[];
};

interface GoalsTableProps {
  goals: Goal[];
}

export default function GoalsTable({ goals }: GoalsTableProps) {
  const calculateCompletion = (tasks: Goal['tasks']) => {
    if (!tasks.length) return 0;
    const completed = tasks.filter(task => task.complete).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getLastCheckIn = (tasks: Goal['tasks']) => {
    if (!tasks.length) return 'No tasks';
    const lastUpdated = new Date(Math.max(...tasks.map(task => new Date(task.updated_at).getTime())));
    return lastUpdated.toLocaleDateString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Check-in</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {goals.map((goal) => (
            <tr key={goal.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{goal.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${calculateCompletion(goal.tasks)}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{calculateCompletion(goal.tasks)}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(goal.due_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{goal.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getLastCheckIn(goal.tasks)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 