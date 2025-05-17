'use client';

import { useState } from 'react';
import AdminTable from './AdminTable';
import FormsTable from './FormsTable';
import QuestionsTable from './QuestionsTable';
import AssessmentsTable from './AssessmentsTable';
import AdminGoalsTable from './AdminGoalsTable';
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  FlagIcon
} from '@heroicons/react/24/outline';

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
  icon: React.ElementType;
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
      displayField: 'name',
      icon: BuildingOffice2Icon
    },
    {
      id: 'departments',
      name: 'Departments',
      data: departments,
      setData: setDepartments,
      type: 'department',
      displayField: 'name',
      icon: UserGroupIcon
    },
    {
      id: 'sites',
      name: 'Sites',
      data: sites,
      setData: setSites,
      type: 'site',
      displayField: 'city',
      icon: MapPinIcon
    },
    {
      id: 'forms',
      name: 'Forms',
      type: 'forms',
      icon: ClipboardDocumentListIcon
    },
    {
      id: 'assessments',
      name: 'Assessments',
      type: 'assessments',
      icon: ClipboardDocumentCheckIcon
    },
    {
      id: 'goals',
      name: 'Goals',
      type: 'goals',
      icon: FlagIcon
    }
  ];

  return (
    <div className="flex">
      {/* Vertical Tabs */}
      <div className="w-64 border-r border-gray-200">
        <nav className="space-y-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                  ${activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 pl-8">
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
  );
} 