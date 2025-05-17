'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { createForm, updateForm } from '../actions';

interface Question {
  id: string;
  name: string;
  type: 'text' | 'yesNo';
}

interface Employee {
  id: string;
  name: string;
}

interface Form {
  id: string;
  name: string;
  questions: string[];
  employees: string[];
}

interface FormsFormProps {
  isOpen: boolean;
  onClose: () => void;
  formToEdit: Form | null;
  questions: Question[];
  employees: Employee[];
}

export default function FormsForm({
  isOpen,
  onClose,
  formToEdit,
  questions,
  employees
}: FormsFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    questions: [] as string[],
    employees: [] as string[]
  });

  const [newQuestion, setNewQuestion] = useState({
    name: '',
    type: 'text' as 'text' | 'yesNo'
  });

  useEffect(() => {
    if (formToEdit) {
      setFormData({
        name: formToEdit.name,
        questions: formToEdit.questions,
        employees: formToEdit.employees
      });
    } else {
      setFormData({
        name: '',
        questions: [],
        employees: []
      });
    }
  }, [formToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name } = e.target;
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, [name]: selectedOptions }));
  };

  const handleNewQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({ ...prev, [name]: value }));
  };

  const handleAddQuestion = () => {
    if (!newQuestion.name) return;

    const questionId = `new_${Date.now()}`;
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, questionId]
    }));
    setNewQuestion({ name: '', type: 'text' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = formToEdit
        ? await updateForm(formToEdit.id, formData)
        : await createForm(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      onClose();
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {formToEdit ? 'Edit Form' : 'Add New Form'}
          </h2>
          <button
            onClick={onClose}
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
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Questions *
            </label>

            {/* Existing Questions */}
            <div className="mb-4">
              <select
                multiple
                name="questions"
                id="questions"
                required
                value={formData.questions}
                onChange={handleMultiSelectChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                size={5}
              >
                {questions.map((question) => (
                  <option key={question.id} value={question.id}>
                    {question.name} ({question.type})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Hold Ctrl (Windows) or Command (Mac) to select multiple questions
              </p>
            </div>

            {/* Add New Question */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Add New Question</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    name="name"
                    value={newQuestion.name}
                    onChange={handleNewQuestionChange}
                    placeholder="Question text"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="w-32">
                  <select
                    name="type"
                    value={newQuestion.type}
                    onChange={handleNewQuestionChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="text">Text</option>
                    <option value="yesNo">Yes/No</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {formToEdit && (
            <div>
              <label htmlFor="employees" className="block text-sm font-medium text-gray-700">
                Employees
              </label>
              <select
                multiple
                name="employees"
                id="employees"
                value={formData.employees}
                onChange={handleMultiSelectChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                size={5}
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Hold Ctrl (Windows) or Command (Mac) to select multiple employees
              </p>
            </div>
          )}

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