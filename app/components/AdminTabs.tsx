'use client';

import { useState } from 'react';
import AdminTable from './AdminTable';
import FormsTable from './FormsTable';
import QuestionsTable from './QuestionsTable';
import AssessmentsTable from './AssessmentsTable';
import AdminGoalsTable from './AdminGoalsTable';

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

interface Goal {
  id: string;
  title: string;
  employee_id: string;
  timeframe: string;
  due_date: string;
  type: 'Personal' | 'Department' | 'Company';
  tasks: {
    id: string;
    title: string;
    complete: boolean;
  }[];
  employee: Employee;
}

interface AdminTabsProps {
  initialPositions: Lookup[];
  initialDepartments: Lookup[];
  initialSites: Lookup[];
  initialForms: Form[];
  initialQuestions: Question[];
  initialEmployees: Employee[];
  initialAssessments: Assessment[];
  initialGoals: Goal[];
}

type TabType = 'position' | 'department' | 'site' | 'forms' | 'assessments' | 'goals';
type DisplayField = 'name' | 'city';

interface Tab {
  id: string;
  name: string;
  data?: Lookup[];
  setData?: (data: Lookup[]) => void;
  type: TabType;
  displayField?: DisplayField;
}

export default function AdminTabs({
  initialPositions,
  initialDepartments,
  initialSites,
  initialForms,
  initialQuestions,
  initialEmployees,
  initialAssessments,
  initialGoals
}: AdminTabsProps) {
  const [positions, setPositions] = useState(initialPositions);
  const [departments, setDepartments] = useState(initialDepartments);
  const [sites, setSites] = useState(initialSites);
  const [forms, setForms] = useState(initialForms);
  const [questions, setQuestions] = useState(initialQuestions);
  const [employees] = useState<Employee[]>(initialEmployees);
  const [assessments, setAssessments] = useState(initialAssessments);
  const [goals, setGoals] = useState(initialGoals);
  const [activeTab, setActiveTab] = useState('positions');

  const handleQuestionAdded = (newQuestion: Question) => {
    setQuestions(prev => [...prev, newQuestion]);
  };

  const handleFormAdded = (newForm: Form) => {
    setForms(prev => [...prev, newForm]);
  };

  const handleAssessmentAdded = (newAssessment: Assessment) => {
    setAssessments(prev => [...prev, newAssessment]);
  };

  const handleGoalAdded = (newGoal: Goal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const tabs: Tab[] = [
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
    },
    {
      id: 'assessments',
      name: 'Assessments',
      type: 'assessments'
    },
    {
      id: 'goals',
      name: 'Goals',
      type: 'goals'
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage positions, departments, sites, forms, assessments, and goals.
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
              ) : tab.type === 'assessments' ? (
                <AssessmentsTable
                  assessments={assessments}
                  forms={forms}
                  employees={employees}
                  onAssessmentAdded={handleAssessmentAdded}
                />
              ) : tab.type === 'goals' ? (
                <AdminGoalsTable
                  goals={goals}
                  employees={employees}
                  onGoalAdded={handleGoalAdded}
                />
              ) : (
                <AdminTable
                  data={tab.data || []}
                  setData={tab.setData || (() => { })}
                  type={tab.type}
                  displayField={tab.displayField || 'name'}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 