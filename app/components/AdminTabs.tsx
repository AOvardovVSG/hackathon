'use client';

import { useState } from 'react';
import AdminTable from './AdminTable';
import FormsTable from './FormsTable';
import QuestionsTable from './QuestionsTable';

interface Lookup {
  id: string;
  name?: string;
  city?: string;
}

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

interface AdminTabsProps {
  initialPositions: Lookup[];
  initialDepartments: Lookup[];
  initialSites: Lookup[];
  initialForms: Form[];
  initialQuestions: Question[];
}

export default function AdminTabs({
  initialPositions,
  initialDepartments,
  initialSites,
  initialForms,
  initialQuestions
}: AdminTabsProps) {
  const [positions, setPositions] = useState(initialPositions);
  const [departments, setDepartments] = useState(initialDepartments);
  const [sites, setSites] = useState(initialSites);
  const [forms, setForms] = useState(initialForms);
  const [questions, setQuestions] = useState(initialQuestions);
  const [activeTab, setActiveTab] = useState('positions');

  const tabs = [
    {
      id: 'positions',
      name: 'Positions',
      data: positions,
      setData: setPositions,
      type: 'position',
      displayField: 'name'
    },
    {
      id: 'departments',
      name: 'Departments',
      data: departments,
      setData: setDepartments,
      type: 'department',
      displayField: 'name'
    },
    {
      id: 'sites',
      name: 'Sites',
      data: sites,
      setData: setSites,
      type: 'site',
      displayField: 'city'
    },
    {
      id: 'forms',
      name: 'Forms',
      type: 'forms'
    }
  ];

  const handleQuestionAdded = (newQuestion: Question) => {
    setQuestions(prev => [...prev, newQuestion]);
  };

  const handleFormAdded = (newForm: Form) => {
    setForms(prev => [...prev, newForm]);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage positions, departments, sites, and forms.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={activeTab === tab.id ? 'block' : 'hidden'}
            >
              {tab.type === 'forms' ? (
                <div className="space-y-8">
                  <QuestionsTable
                    questions={questions}
                    onQuestionAdded={handleQuestionAdded}
                  />
                  <FormsTable
                    forms={forms}
                    questions={questions}
                    onFormAdded={handleFormAdded}
                  />
                </div>
              ) : (
                <AdminTable
                  data={tab.data}
                  setData={tab.setData}
                  type={tab.type}
                  displayField={tab.displayField}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 