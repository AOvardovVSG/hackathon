'use server';

import { createClient } from '@/utils/supabase/server';

interface CreateEmployeeData {
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName?: string;
  email: string;
  positionId: string;
  address: string;
  siteId: string;
  managerId?: string;
  employmentType: 'fullTime' | 'partTime';
  startDate: string;
  endDate?: string;
  departmentId: string;
}

export async function createEmployee(data: CreateEmployeeData) {
  const supabase = await createClient();

  try {
    const { data: newEmployee, error } = await supabase
      .from('employees')
      .insert([
        {
          first_name: data.firstName,
          middle_name: data.middleName || null,
          last_name: data.lastName,
          display_name: data.displayName || `${data.firstName} ${data.lastName}`,
          email: data.email,
          position_id: data.positionId,
          address: data.address,
          site_id: data.siteId,
          manager_id: data.managerId || null,
          employment_type: data.employmentType,
          start_date: data.startDate,
          end_date: data.endDate || null,
          department_id: data.departmentId,
          picture_url: null // TODO: Implement image upload
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: newEmployee };
  } catch (error) {
    console.error('Error creating employee:', error);
    return { success: false, error: 'Failed to create employee' };
  }
} 