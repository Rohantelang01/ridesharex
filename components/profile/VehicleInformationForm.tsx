"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { IOwnerInfo } from "@/types/profile";

const vehicleSchema = z.object({
    _id: z.string().optional(),
    make: z.string().min(1, "Make is required"),
    vehicleModel: z.string().min(1, "Model is required"),
    year: z.coerce.number().min(1990, "Invalid year"),
    color: z.string().min(1, "Color is required"),
    plateNumber: z.string().min(1, "Plate number is required"),
    vehicleType: z.enum(['car', 'bike', 'auto', 'bus', 'truck']),
    seatingCapacity: z.coerce.number().min(1, "Invalid capacity"),
    perKmRate: z.coerce.number().min(1, "Rate is required"),
    rcDocument: z.string().url().optional().or(z.literal("")),
    insurance: z.string().url().optional().or(z.literal("")),
    vehicleImages: z.array(z.string().url()).optional(),
    isAvailable: z.boolean().default(true),
});

const formSchema = z.object({
  vehicles: z.array(vehicleSchema),
});

interface VehicleInformationFormProps {
  data?: IOwnerInfo;
  onSave: (data: { vehicles: z.infer<typeof vehicleSchema>[] }) => Promise<{ success: boolean; error?: string }>;
  onDelete: (vehicleId: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  onCancel: () => void;
}

const VehicleInformationForm = ({ data, onSave, onDelete, isLoading, onCancel }: VehicleInformationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const transformIncomingData = (vehicles: any[] | undefined) => {
    if (!vehicles) return [];
    return vehicles.map(vehicle => ({
      ...vehicle,
      vehicleModel: vehicle.vehicleModel || vehicle.model || '',
    }));
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicles: transformIncomingData(data?.vehicles),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vehicles",
  });

  useEffect(() => {
    if (data?.vehicles) {
      form.reset({ vehicles: transformIncomingData(data.vehicles) });
    }
  }, [data, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await onSave({ vehicles: values.vehicles });
      if (result.success) {
        console.log("Vehicle information updated successfully");
      } else {
        console.error("Failed to update vehicle information:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRemove(index: number, vehicleId?: string) {
    if (vehicleId) {
      const result = await onDelete(vehicleId);
      if (result.success) {
        remove(index);
        console.log("Vehicle deleted successfully");
      } else {
        console.error("Failed to delete vehicle:", result.error);
      }
    } else {
      remove(index);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Your Vehicle(s)</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="border-b pb-6 mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField control={form.control} name={`vehicles.${index}.make`} render={({ field }) => (<FormItem><FormLabel>Make</FormLabel><FormControl><Input placeholder="e.g., Toyota" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`vehicles.${index}.vehicleModel`} render={({ field }) => (<FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g., Camry" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`vehicles.${index}.year`} render={({ field }) => (<FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" placeholder="e.g., 2023" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`vehicles.${index}.color`} render={({ field }) => (<FormItem><FormLabel>Color</FormLabel><FormControl><Input placeholder="e.g., Blue" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`vehicles.${index}.plateNumber`} render={({ field }) => (<FormItem><FormLabel>Plate Number</FormLabel><FormControl><Input placeholder="e.g., ABC-1234" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`vehicles.${index}.vehicleType`} render={({ field }) => (<FormItem><FormLabel>Vehicle Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a vehicle type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="car">Car</SelectItem><SelectItem value="bike">Bike</SelectItem><SelectItem value="auto">Auto Rickshaw</SelectItem><SelectItem value="bus">Bus</SelectItem><SelectItem value="truck">Truck</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`vehicles.${index}.seatingCapacity`} render={({ field }) => (<FormItem><FormLabel>Seating Capacity</FormLabel><FormControl><Input type="number" placeholder="e.g., 4" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`vehicles.${index}.perKmRate`} render={({ field }) => (<FormItem><FormLabel>Rate per Km</FormLabel><FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`vehicles.${index}.rcDocument`} render={({ field }) => (<FormItem><FormLabel>RC Document URL</FormLabel><FormControl><Input placeholder="https://example.com/rc.pdf" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`vehicles.${index}.insurance`} render={({ field }) => (<FormItem><FormLabel>Insurance URL</FormLabel><FormControl><Input placeholder="https://example.com/insurance.pdf" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField
                  control={form.control}
                  name={`vehicles.${index}.isAvailable`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 col-span-1 md:col-span-2 lg:col-span-3">
                      <div className="space-y-0.5"><FormLabel className="text-base">Is this vehicle available?</FormLabel></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="button" variant="destructive" onClick={() => handleRemove(index, field._id)}>Remove Vehicle</Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => append({ make: "", vehicleModel: "", year: new Date().getFullYear(), color: "", plateNumber: "", vehicleType: "car", seatingCapacity: 4, perKmRate: 10, rcDocument: "", insurance: "", isAvailable: true })}
          >
            Add Another Vehicle
          </Button>
        </div>

        <div className="flex gap-4 pt-8">
          <Button type="submit" disabled={isSubmitting || isLoading} className="flex-1">
            {isSubmitting || isLoading ? "Saving Vehicles..." : "Save Vehicle Information"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleInformationForm;
