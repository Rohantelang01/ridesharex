
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { IDriverInfo } from "@/types/profile";

const vehicleTypes = z.enum(['car', 'bike', 'auto', 'bus', 'truck']);

const formSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  hourlyRate: z.coerce.number().min(50, "Hourly rate must be at least ₹50"),
  licenseImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  idProof: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  status: z.enum(['OFFLINE', 'AVAILABLE', 'ON_TRIP', 'SCHEDULED']).default('OFFLINE'),
  vehicleTypes: z.array(vehicleTypes).optional(),
});

interface DrivingInformationFormProps {
  data?: IDriverInfo;
  onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  onCancel: () => void;
}

const DrivingInformationForm = ({ data, onSave, isLoading, onCancel }: DrivingInformationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licenseNumber: data?.licenseNumber || "",
      hourlyRate: data?.hourlyRate || 50,
      licenseImage: data?.licenseImage || "",
      idProof: data?.idProof || "",
      status: data?.status || 'OFFLINE',
      vehicleTypes: data?.vehicleTypes || [],
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        licenseNumber: data.licenseNumber || "",
        hourlyRate: data.hourlyRate || 50,
        licenseImage: data.licenseImage || "",
        idProof: data.idProof || "",
        status: data.status || 'OFFLINE',
        vehicleTypes: data.vehicleTypes || [],
      });
    }
  }, [data, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await onSave(values);
      if (result.success) {
        console.log("Driving information updated successfully");
      } else {
        console.error("Failed to update driving information:", result.error);
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
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Number *</FormLabel>
                <FormControl>
                  <Input placeholder="Your License Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate (₹) *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 250" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="OFFLINE">Offline</SelectItem>
                    <SelectItem value="ON_TRIP">On a Trip</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="licenseImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/license.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="idProof"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Proof URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/id-proof.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Vehicle Types</h3>
          <FormField
            control={form.control}
            name="vehicleTypes"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {vehicleTypes.options.map((type) => (
                    <FormField
                      key={type}
                      control={form.control}
                      name="vehicleTypes"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={type}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(type)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), type])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== type
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1"
          >
            {isSubmitting || isLoading ? "Saving..." : "Save Driving Information"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DrivingInformationForm;
