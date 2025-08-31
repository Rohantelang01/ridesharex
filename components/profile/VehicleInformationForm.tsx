
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import DrivingInformationForm from "./DrivingInformationForm";

const formSchema = z.object({
  vehicleTypes: z.string().optional(),
  kmRateDefault: z.coerce.number().min(1, "Rate must be at least ₹1").optional(),
  canDriveSelf: z.boolean().default(false),
});

interface VehicleInformationFormProps {
  data?: any;
  onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  canDriveSelf?: boolean;
}

const VehicleInformationForm = ({ data, onSave, isLoading, canDriveSelf }: VehicleInformationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDriverForm, setShowDriverForm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleTypes: "",
      kmRateDefault: 0,
      canDriveSelf: false,
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (data) {
      form.reset({
        vehicleTypes: data.vehicleTypes?.join(", ") || "",
        kmRateDefault: data.kmRate?.get("default") || 0,
        canDriveSelf: data.canDriveSelf || false,
      });
      setShowDriverForm(data.canDriveSelf || false);
    }
  }, [data, form]);

  // Watch canDriveSelf to show/hide driver form
  const watchCanDriveSelf = form.watch("canDriveSelf");
  useEffect(() => {
    setShowDriverForm(watchCanDriveSelf);
  }, [watchCanDriveSelf]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Transform form data to match your model structure
      const vehicleData = {
        vehicleTypes: values.vehicleTypes ? values.vehicleTypes.split(",").map(t => t.trim()) : [],
        kmRate: new Map([["default", values.kmRateDefault || 0]]),
        canDriveSelf: values.canDriveSelf,
      };

      const result = await onSave(vehicleData);
      
      if (result.success) {
        console.log("Vehicle information updated successfully");
        // You can show a success toast here
      } else {
        console.error("Failed to update vehicle information:", result.error);
        // You can show an error toast here
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="vehicleTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Types (comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Sedan, SUV, Hatchback" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kmRateDefault"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Rate per KM (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="canDriveSelf"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Do you drive your own vehicle?
                </FormLabel>
                <p className="text-sm text-gray-500">
                  Check this if you want to provide driver information
                </p>
              </div>
            </FormItem>
          )}
        />

        {showDriverForm && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Driver Information</h3>
            <DrivingInformationForm 
              data={data?.driverInfo}
              onSave={async (driverData) => {
                // This will be handled by the parent form submission
                return { success: true };
              }}
              isLoading={isLoading}
              userRole="owner"
            />
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isSubmitting || isLoading}
            className="flex-1"
          >
            {isSubmitting || isLoading ? "Saving..." : "Save Vehicle Information"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VehicleInformationForm;
