
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
import { IOwnerInfo, IDriverInfo } from "@/types/profile";
import DrivingInformationForm from './DrivingInformationForm'; // Import the driver form

const vehicleSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
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
  canDriveSelf: z.boolean().default(false),
  driverInfo: z.any().optional(), // To hold driver info if canDriveSelf is true
});

interface VehicleInformationFormProps {
  data?: IOwnerInfo;
  onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  canDriveSelf: boolean;
}

const VehicleInformationForm = ({ data, onSave, isLoading, canDriveSelf: initialCanDriveSelf }: VehicleInformationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canDriveSelf, setCanDriveSelf] = useState(initialCanDriveSelf);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicles: [],
      canDriveSelf: initialCanDriveSelf,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vehicles",
  });

  useEffect(() => {
    if (data?.vehicles) {
      form.reset({ vehicles: data.vehicles, canDriveSelf: initialCanDriveSelf });
    }
  }, [data, form, initialCanDriveSelf]);

  const handleDrivingSave = async (drivingData: IDriverInfo) => {
    form.setValue('driverInfo', drivingData);
    return { success: true };
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const dataToSave: any = {
        vehicles: values.vehicles,
        canDriveSelf: values.canDriveSelf,
      };

      if (values.canDriveSelf) {
        // If the driver form has been touched, its data will be in `values.driverInfo`
        if (values.driverInfo) {
          dataToSave.driverInfo = values.driverInfo;
        }
      }

      const result = await onSave(dataToSave);
      if (result.success) {
        console.log("Vehicle and driver information updated successfully");
      } else {
        console.error("Failed to update information:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="canDriveSelf"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Drive Your Own Vehicle?</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Enable this if you want to be a driver for your own vehicle.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setCanDriveSelf(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {canDriveSelf && (
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Your Driver Information</h3>
            <DrivingInformationForm
              data={data?.driverInfo || {}}
              onSave={handleDrivingSave} // This will just update the form state
              isLoading={isSubmitting}
              userRole="owner"
            />
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Your Vehicle(s)</h3>
          {fields.map((field, index) => (
            <div key={field.id} className="border-t pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* ... (rest of the vehicle fields) ... */}
              </div>
              <Button type="button" variant="destructive" onClick={() => remove(index)}>Remove Vehicle</Button>
            </div>
          ))}
          
          <Button
            type="button"
            onClick={() => append({ make: "", model: "", year: new Date().getFullYear(), color: "", plateNumber: "", vehicleType: "car", seatingCapacity: 4, perKmRate: 10, isAvailable: true })}
          >
            Add Another Vehicle
          </Button>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting || isLoading} className="flex-1">
            {isSubmitting || isLoading ? "Saving..." : "Save All Information"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleInformationForm;
