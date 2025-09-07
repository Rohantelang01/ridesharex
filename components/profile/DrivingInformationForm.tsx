
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
import { useEffect, useState } from "react";
import { IDriverInfo } from "@/types/profile";

const formSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  hourlyRate: z.coerce.number().min(50, "Hourly rate must be at least ₹50"),
  vehicleType: z.enum(['own', 'rented']),
  licenseImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  idProof: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  isOnline: z.boolean().default(true),
});

interface DrivingInformationFormProps {
  data?: IDriverInfo;
  onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const DrivingInformationForm = ({ data, onSave, isLoading }: DrivingInformationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licenseNumber: "",
      hourlyRate: 50,
      vehicleType: "own",
      licenseImage: "",
      idProof: "",
      isOnline: true,
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (data) {
      form.reset({
        licenseNumber: data.licenseNumber || "",
        hourlyRate: data.hourlyRate || 50,
        vehicleType: data.vehicleType || "own",
        licenseImage: data.licenseImage || "",
        idProof: data.idProof || "",
        isOnline: data.isOnline !== undefined ? data.isOnline : true,
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
                name="vehicleType"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="own">Own</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
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

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isSubmitting || isLoading}
            className="flex-1"
          >
            {isSubmitting || isLoading ? "Saving..." : "Save Driving Information"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DrivingInformationForm;
