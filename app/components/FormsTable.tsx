'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createForm } from '../actions';
import MultiSelect from './MultiSelect';

interface Question {
  id: string;
  name: string;
  type: 'Text' | 'YesNoQuestion';
}

interface Form {
  id: string;
  name: string;
  questions: string[];
}

interface FormsTableProps {
  forms: Form[];
  questions: Question[];
  onFormAdded: (form: Form) => void;
}

export default function FormsTable({
  forms,
  questions,
  onFormAdded
}: FormsTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [form, setForm] = useState({
    id: '',
    name: '',
    questions: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionsChange = (selectedQuestions: string[]) => {
    setForm(prev => ({ ...prev, questions: selectedQuestions }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      questions: form.questions
    };

    const result = await createForm(data);

    if (result.success && result.data) {
      onFormAdded(result.data);
      setForm({ id: '', name: '', questions: [] });
      setIsFormOpen(false);
    }
  };

  const handleClose = () => {
    setForm({ id: '', name: '', questions: [] });
    setIsFormOpen(false);
  };

  const handleViewForm = (form: Form) => {
    setSelectedForm(form);
  };

  const handleCloseView = () => {
    setSelectedForm(null);
  };

  const questionOptions = questions.map(question => ({
    id: question.id,
    label: question.name,
    description: question.type
  }));

  const getQuestionDetails = (questionId: string) => {
    return questions.find(q => q.id === questionId);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Forms</h2>
          <p className="mt-2 text-sm text-gray-700">
            Manage forms and their associated questions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Form
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto max-w-[2000px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Questions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {forms.map((form) => (
              <tr
                key={form.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewForm(form)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {form.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {form.questions.length} questions
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Form
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={form.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                />
              </div>

              <MultiSelect
                label="Questions"
                options={questionOptions}
                value={form.questions}
                onChange={handleQuestionsChange}
                required
                placeholder="Select questions..."
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

      {/* View Form Modal */}
      {selectedForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedForm.name}
              </h2>
              <button
                onClick={handleCloseView}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Questions ({selectedForm.questions.length})
              </h3>
              <div className="space-y-4">
                {selectedForm.questions.map((questionId) => {
                  const question = getQuestionDetails(questionId);
                  if (!question) return null;
                  return (
                    <div key={questionId} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{question.name}</p>
                        <p className="text-sm text-gray-500">
                          Type: {question.type === 'YesNoQuestion' ? 'Yes/No' : 'Text'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end p-6 border-t">
              <button
                type="button"
                onClick={handleCloseView}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 