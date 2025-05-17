'use client';

import { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { submitAssessment, getAssessmentAnswers } from '@/app/actions';
import Loading from '@/app/loading';

interface Question {
  id: string;
  name: string;
  type: 'Text' | 'YesNoQuestion';
}

interface Form {
  id: string;
  name: string;
  questions: Question[];
}

interface Assessment {
  id: string;
  form_id: string;
  employee_ids: string[];
  completed_employee_ids: string[];
  created_at: string;
  form: Form | null;
}

interface MyDocTableProps {
  assessments: Assessment[];
  employeeId: string;
}

export default function MyDocTable({ assessments: initialAssessments, employeeId }: MyDocTableProps) {
  const [assessments, setAssessments] = useState<Assessment[]>(initialAssessments);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setAssessments(initialAssessments);
  }, [initialAssessments]);

  const handleEdit = (assessment: Assessment) => {
    if (!assessment.form) return;

    // Initialize answers with empty strings
    const initialAnswers: Record<string, string> = {};
    assessment.form.questions.forEach((question) => {
      initialAnswers[question.id] = '';
    });
    setAnswers(initialAnswers);
    setSelectedAssessment(assessment);
    setError(null);
    setIsViewMode(false);
  };

  const handleView = async (assessment: Assessment) => {
    if (!assessment.form) return;

    setSelectedAssessment(assessment);
    setIsViewMode(true);
    setError(null);
    setIsLoading(true);

    try {
      const result = await getAssessmentAnswers(assessment.id, employeeId);

      if (!result.success || !result.data) {
        setError('Failed to load answers. Please try again.');
        return;
      }

      setAnswers(result.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedAssessment(null);
    setAnswers({});
    setError(null);
    setIsViewMode(false);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const validateAnswers = () => {
    if (!selectedAssessment?.form) return false;

    // Check if all questions have answers
    const allQuestionsAnswered = selectedAssessment.form.questions.every(
      (question) => answers[question.id]?.trim() !== ''
    );

    if (!allQuestionsAnswered) {
      setError('Please answer all questions before submitting.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!selectedAssessment?.form) return;

    // Validate all questions are answered
    if (!validateAnswers()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Format answers for submission
      const formattedAnswers = selectedAssessment.form.questions.map(question => ({
        questionId: question.id,
        answer: answers[question.id] || ''
      }));

      const result = await submitAssessment(
        selectedAssessment.id,
        employeeId,
        selectedAssessment.completed_employee_ids || [],
        formattedAnswers
      );

      if (!result.success) {
        throw new Error(typeof result.error === 'string' ? result.error : 'Failed to submit assessment');
      }

      // Update local state
      setAssessments(prevAssessments =>
        prevAssessments.map(assessment =>
          assessment.id === selectedAssessment.id
            ? {
              ...assessment,
              completed_employee_ids: [...(assessment.completed_employee_ids || []), employeeId]
            }
            : assessment
        )
      );

      handleClose();
    } catch {
      setError('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Form Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assessments.map((assessment) => {
                  const isCompleted = assessment.completed_employee_ids?.includes(employeeId);
                  return (
                    <tr
                      key={assessment.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => isCompleted ? handleView(assessment) : handleEdit(assessment)}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {assessment.form?.name || 'Unknown Form'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {isCompleted ? 'Completed' : 'Not Started'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        {!isCompleted && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(assessment);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedAssessment && selectedAssessment.form && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">{selectedAssessment.form.name}</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            {isLoading ? (
              <Loading message="Loading answers..." />
            ) : isViewMode ? (
              <div className="space-y-4">
                {selectedAssessment.form.questions.map((question) => (
                  <div key={question.id} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {question.name}
                    </label>
                    <div className="mt-1 text-sm text-gray-900">
                      {answers[question.id] || 'No answer provided'}
                    </div>
                  </div>
                ))}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {selectedAssessment.form.questions.map((question) => (
                  <div key={question.id} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {question.name} <span className="text-red-500">*</span>
                    </label>
                    {question.type === 'Text' ? (
                      <input
                        type="text"
                        required
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                      />
                    ) : (
                      <div className="space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            required
                            name={`question-${question.id}`}
                            value="Yes"
                            checked={answers[question.id] === 'Yes'}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            required
                            name={`question-${question.id}`}
                            value="No"
                            checked={answers[question.id] === 'No'}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">No</span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 