import { createClient } from '@/utils/supabase/server';
import AdminTabs from '../components/AdminTabs';

export default async function AdminPage() {
  const supabase = await createClient();

  const [
    { data: positions },
    { data: departments },
    { data: sites },
    { data: forms },
    { data: questions },
    { data: employees },
    { data: assessments },
    { data: goals }
  ] = await Promise.all([
    supabase.from('positions').select('*'),
    supabase.from('departments').select('*'),
    supabase.from('sites').select('*'),
    supabase.from('forms').select('*'),
    supabase.from('questions').select('*'),
    supabase.from('employees').select('id, display_name'),
    supabase.from('assessments').select('*'),
    supabase.from('goals')
      .select(`
        *,
        employee:employees(id, display_name),
        tasks:tasks(*)
      `)
      .order('created_at', { ascending: false })
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      <AdminTabs
        initialPositions={positions || []}
        initialDepartments={departments || []}
        initialSites={sites || []}
        initialForms={forms || []}
        initialQuestions={questions || []}
        initialEmployees={employees || []}
        initialAssessments={assessments || []}
        initialGoals={goals || []}
      />
    </div>
  );
} 