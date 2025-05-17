import { createClient } from '@/utils/supabase/server';
import AdminTabs from '../components/AdminTabs';

export default async function AdminPage() {
  const supabase = await createClient();

  const [
    { data: positions, error: positionsError },
    { data: departments, error: departmentsError },
    { data: sites, error: sitesError }
  ] = await Promise.all([
    supabase.from('positions').select('*').order('name', { ascending: true }),
    supabase.from('departments').select('*').order('name', { ascending: true }),
    supabase.from('sites').select('*').order('city', { ascending: true })
  ]);

  console.log('Data fetched:', { positions, departments, sites });
  console.log('Errors if any:', { positionsError, departmentsError, sitesError });

  return (
    <AdminTabs
      initialPositions={positions || []}
      initialDepartments={departments || []}
      initialSites={sites || []}
    />
  );
} 