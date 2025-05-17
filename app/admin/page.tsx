import { createClient } from '@supabase/supabase-js';
import AdminTabs from '../components/AdminTabs';

export default async function AdminPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [
    { data: positions },
    { data: departments },
    { data: sites },
    { data: forms },
    { data: questions },
    { data: employees }
  ] = await Promise.all([
    supabase.from('positions').select('*').order('name', { ascending: true }),
    supabase.from('departments').select('*').order('name', { ascending: true }),
    supabase.from('sites').select('*').order('city', { ascending: true }),
    supabase.from('forms').select('*').order('name', { ascending: true }),
    supabase.from('questions').select('*').order('name', { ascending: true }),
    supabase.from('employees').select('*').order('name', { ascending: true })
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
      />
    </div>
  );
} 