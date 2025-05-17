import { createClient } from '@/utils/supabase/server';
import EmployeeManagement from '../components/EmployeeManagement';

export default async function OrgPage() {
  const supabase = await createClient();

  console.log('Fetching data...');

  const [
    { data: employees, error: employeesError },
    { data: positions, error: positionsError },
    { data: departments, error: departmentsError },
    { data: sites, error: sitesError }
  ] = await Promise.all([
    supabase.from('employees').select('*').order('first_name', { ascending: true }),
    supabase.from('positions').select('*').order('name', { ascending: true }),
    supabase.from('departments').select('*').order('name', { ascending: true }),
    supabase.from('sites').select('*').order('city', { ascending: true })
  ]);

  console.log('Data fetched:', { employees, positions, departments, sites });
  console.log('Errors if any:', { employeesError, positionsError, departmentsError, sitesError });

  return (
    <EmployeeManagement
      initialEmployees={employees || []}
      positions={positions || []}
      departments={departments || []}
      sites={sites || []}
    />
  );
} 