
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AddressFormValues } from "@/components/account/ShippingAddressForm";
import { Address } from "@/components/account/AddressList";
import { toast } from "sonner";

export const useAddresses = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch addresses from Supabase
  const fetchAddresses = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // For now, we'll use mock data if Supabase integration isn't complete
      // In a real implementation, you would fetch from your database
      const mockAddresses: Address[] = [
        {
          id: "1",
          fullName: "John Doe",
          street: "123 Main Street",
          city: "Nairobi",
          state: "Nairobi",
          postalCode: "00100",
          country: "Kenya",
          phone: "+254 712 345 678",
          isDefault: true,
        },
        {
          id: "2",
          fullName: "John Doe",
          street: "456 Market Avenue",
          city: "Mombasa",
          state: "Coast",
          postalCode: "80100",
          country: "Kenya",
          phone: "+254 712 345 678",
          isDefault: false,
        },
      ];

      setAddresses(mockAddresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load your addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  // Add a new address
  const addAddress = async (addressData: AddressFormValues): Promise<void> => {
    if (!user) return;
    
    try {
      // For now, simulate adding an address
      const newAddress: Address = {
        id: Math.random().toString(36).substring(2, 15),
        ...addressData,
      };
      
      // If this is the first address or marked as default, 
      // ensure it's set as default
      if (addresses.length === 0 || addressData.isDefault) {
        // Set all other addresses to non-default
        const updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: false,
        }));
        setAddresses([...updatedAddresses, newAddress]);
      } else {
        setAddresses([...addresses, newAddress]);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      throw error;
    }
  };

  // Update an existing address
  const updateAddress = async (id: string, addressData: AddressFormValues): Promise<void> => {
    if (!user) return;
    
    try {
      // For now, simulate updating an address
      const updatedAddresses = addresses.map(addr => {
        if (addr.id === id) {
          return {
            ...addr,
            ...addressData,
          };
        }
        
        // If the current address is being set as default,
        // ensure all others are not default
        if (addressData.isDefault && addr.id !== id) {
          return { ...addr, isDefault: false };
        }
        
        return addr;
      });
      
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  };

  // Delete an address
  const deleteAddress = async (id: string): Promise<void> => {
    if (!user) return;
    
    try {
      // For now, simulate deleting an address
      const filteredAddresses = addresses.filter(addr => addr.id !== id);
      
      // If we deleted the default address and there are other addresses,
      // set the first one as default
      if (addresses.find(addr => addr.id === id)?.isDefault && filteredAddresses.length > 0) {
        filteredAddresses[0].isDefault = true;
      }
      
      setAddresses(filteredAddresses);
    } catch (error) {
      console.error("Error deleting address:", error);
      throw error;
    }
  };

  // Set an address as default
  const setDefaultAddress = async (id: string): Promise<void> => {
    if (!user) return;
    
    try {
      // For now, simulate setting a default address
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }));
      
      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error setting default address:", error);
      throw error;
    }
  };

  return {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refreshAddresses: fetchAddresses,
  };
};
