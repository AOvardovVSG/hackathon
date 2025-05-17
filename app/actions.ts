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

interface UpdateEmployeeData extends CreateEmployeeData {
  id: string;
}

interface LookupData {
  name?: string;
  city?: string;
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

export async function updateEmployee(data: UpdateEmployeeData) {
  const supabase = await createClient();

  try {
    const { data: updatedEmployee, error } = await supabase
      .from('employees')
      .update({
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
        department_id: data.departmentId
      })
      .eq('id', data.id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: updatedEmployee };
  } catch (error) {
    console.error('Error updating employee:', error);
    return { success: false, error: 'Failed to update employee' };
  }
}

export async function deleteEmployee(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting employee:', error);
    return { success: false, error: 'Failed to delete employee' };
  }
}

export async function createLookup(type: 'position' | 'department' | 'site', data: LookupData) {
  const supabase = await createClient();

  try {
    const { data: newItem, error } = await supabase
      .from(`${type}s`)
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: newItem };
  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    return { success: false, error: `Failed to create ${type}` };
  }
}

export async function updateLookup(type: 'position' | 'department' | 'site', id: string, data: LookupData) {
  const supabase = await createClient();

  try {
    const { data: updatedItem, error } = await supabase
      .from(`${type}s`)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: updatedItem };
  } catch (error) {
    console.error(`Error updating ${type}:`, error);
    return { success: false, error: `Failed to update ${type}` };
  }
}

export async function deleteLookup(type: 'position' | 'department' | 'site', id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from(`${type}s`)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    return { success: false, error: `Failed to delete ${type}` };
  }
} 