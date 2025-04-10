
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Profile } from '@/types';

export const useProfile = () => {
  const { user, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (userId?: string): Promise<Profile | null> => {
    const profileId = userId || user?.id;
    
    if (!profileId) {
      setError('User not authenticated');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data as Profile;
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to fetch profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (updates: Partial<Profile>): Promise<Profile | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Refresh user data in auth context to reflect changes
      await refreshUserData();
      
      toast.success('Profile updated successfully');
      return data as Profile;
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
      toast.error('Failed to update profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const addAddress = async (address: any): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First, get current addresses
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('address_book')
        .eq('id', user.id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Add new address to the array
      const addressBook = profile.address_book || [];
      const newAddress = {
        id: crypto.randomUUID(),
        isDefault: addressBook.length === 0, // First address is default
        ...address
      };
      
      // Update profile with new address book
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          address_book: [...addressBook, newAddress]
        })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      toast.success('Address added successfully');
      return true;
    } catch (err: any) {
      console.error('Error adding address:', err);
      setError(err.message || 'Failed to add address');
      toast.error('Failed to add address');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateAddress = async (addressId: string, updates: any): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First, get current addresses
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('address_book')
        .eq('id', user.id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      const addressBook = profile.address_book || [];
      
      // Find and update the address
      const updatedAddressBook = addressBook.map((addr: any) => 
        addr.id === addressId ? { ...addr, ...updates } : addr
      );
      
      // Handle setting an address as default
      if (updates.isDefault) {
        updatedAddressBook.forEach((addr: any) => {
          if (addr.id !== addressId) {
            addr.isDefault = false;
          }
        });
      }
      
      // Update profile with modified address book
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          address_book: updatedAddressBook
        })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      toast.success('Address updated successfully');
      return true;
    } catch (err: any) {
      console.error('Error updating address:', err);
      setError(err.message || 'Failed to update address');
      toast.error('Failed to update address');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteAddress = async (addressId: string): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First, get current addresses
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('address_book')
        .eq('id', user.id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      const addressBook = profile.address_book || [];
      
      // Filter out the address to delete
      const filteredAddressBook = addressBook.filter((addr: any) => addr.id !== addressId);
      
      // If the deleted address was default, make another one default
      const wasDefault = addressBook.find((addr: any) => addr.id === addressId)?.isDefault;
      if (wasDefault && filteredAddressBook.length > 0) {
        filteredAddressBook[0].isDefault = true;
      }
      
      // Update profile with filtered address book
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          address_book: filteredAddressBook
        })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      toast.success('Address deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting address:', err);
      setError(err.message || 'Failed to delete address');
      toast.error('Failed to delete address');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress
  };
};
