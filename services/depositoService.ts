import { supabase } from '../lib/supabase';
import { Deposito } from '../models/Deposito';

export const getDepositos = async (): Promise<Deposito[]> => {
  const { data, error } = await supabase
    .from('depositos')
    .select('*')
    .order('creado_en', { ascending: false });

  if (error) {
    console.error('Error fetching depositos:', error);
    throw error;
  }

  return data || [];
};

export const createDeposito = async (deposito: Omit<Deposito, 'id' | 'creado_en'>): Promise<Deposito> => {
  const { data, error } = await supabase
    .from('depositos')
    .insert(deposito)
    .select()
    .single();

  if (error) {
    console.error('Error creating deposito:', error);
    throw error;
  }

  return data;
};