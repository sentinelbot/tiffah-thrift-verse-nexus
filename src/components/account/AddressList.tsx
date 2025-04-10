
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Home, Check } from "lucide-react";
import { AddressFormValues, ShippingAddressForm } from "./ShippingAddressForm";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

interface AddressListProps {
  addresses: Address[];
  onAddAddress: (address: AddressFormValues) => Promise<void>;
  onUpdateAddress: (id: string, address: AddressFormValues) => Promise<void>;
  onDeleteAddress: (id: string) => Promise<void>;
  onSetDefault: (id: string) => Promise<void>;
}

export const AddressList = ({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefault,
}: AddressListProps) => {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<{id: string; data: AddressFormValues} | null>(null);
  
  const handleAddSubmit = async (data: AddressFormValues) => {
    await onAddAddress(data);
    setIsAddingAddress(false);
    toast.success("Address added successfully");
  };
  
  const handleEditSubmit = async (data: AddressFormValues) => {
    if (editingAddress) {
      await onUpdateAddress(editingAddress.id, data);
      setEditingAddress(null);
      toast.success("Address updated successfully");
    }
  };
  
  const handleDelete = async (id: string) => {
    await onDeleteAddress(id);
    toast.success("Address deleted successfully");
  };
  
  const handleSetDefault = async (id: string) => {
    await onSetDefault(id);
    toast.success("Default address updated");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Shipping Addresses</h3>
        <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Shipping Address</DialogTitle>
              <DialogDescription>
                Add a new address for your orders to be shipped to.
              </DialogDescription>
            </DialogHeader>
            <ShippingAddressForm 
              onSubmit={handleAddSubmit} 
              onCancel={() => setIsAddingAddress(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {addresses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Home className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              You haven't added any shipping addresses yet.
            </p>
            <Button onClick={() => setIsAddingAddress(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{address.fullName}</CardTitle>
                  {address.isDefault && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-sm flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Default
                    </span>
                  )}
                </div>
                <CardDescription>{address.phone}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2 text-sm">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div className="flex space-x-2">
                  <Dialog 
                    open={editingAddress?.id === address.id} 
                    onOpenChange={(open) => !open && setEditingAddress(null)}
                  >
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingAddress({
                          id: address.id, 
                          data: {...address}
                        })}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Edit Shipping Address</DialogTitle>
                        <DialogDescription>
                          Update your shipping address details.
                        </DialogDescription>
                      </DialogHeader>
                      {editingAddress?.id === address.id && (
                        <ShippingAddressForm 
                          defaultValues={editingAddress.data}
                          onSubmit={handleEditSubmit} 
                          onCancel={() => setEditingAddress(null)}
                          isEditing={true}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Address</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this address? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(address.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                
                {!address.isDefault && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
