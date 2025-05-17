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
    supabase.from('positions').select('*').order('name'),
    supabase.from('departments').select('*').order('name'),
    supabase.from('sites').select('*').order('city'),
    supabase.from('forms').select('*').order('name'),
    supabase.from('questions').select('*').order('name'),
    supabase.from('employees').select('id, display_name').order('display_name'),
    supabase.from('assessments').select('*, form:forms(*)').order('created_at', { ascending: false }),
    supabase.from('goals').select(`
      *,
      tasks:tasks (*),
      employee:employees (
        id,
        display_name
      )
    `).order('created_at', { ascending: false })
  ]);

  return (
    <div className="pt-8">
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