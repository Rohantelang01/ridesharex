
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
import { DatePicker } from "@/components/ui/date-picker";
import { useEffect, useState } from "react";
import { UserProfile } from "@/types/profile";

const formSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  licenseExpiry: z.date({
    required_error: "License expiry date is required",
  }),
  experience: z.coerce.number().min(0, "Experience must be at least 0 years"),
  driverImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  hourlyRate: z.coerce.number().min(50, "Hourly rate must be at least ₹50"),
  licenseImageFront: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  licenseImageBack: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  aadharImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  panImage: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  vehicleTypes: z.string().optional(),
  isAvailable: z.boolean().default(true),
  locationLat: z.coerce.number().min(-90).max(90).optional().or(z.literal("")),
  locationLng: z.coerce.number().min(-180).max(180).optional().or(z.literal("")),
});

interface DrivingInformationFormProps {
  data?: any;
  onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  userRole: string;
}

const DrivingInformationForm = ({ data, onSave, isLoading, userRole }: DrivingInformationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licenseNumber: "",
      experience: 0,
      driverImage: "",
      hourlyRate: 0,
      licenseImageFront: "",
      licenseImageBack: "",
      aadharImage: "",
      panImage: "",
      vehicleTypes: "",
      isAvailable: true,
      locationLat: "",
      locationLng: "",
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (data) {
      form.reset({
        licenseNumber: data.licenseNumber || "",
        experience: data.experience || 0,
        driverImage: data.driverImage || "",
        hourlyRate: data.hourlyRate || 0,
        licenseImageFront: data.documents?.licenseImageFront || "",
        licenseImageBack: data.documents?.licenseImageBack || "",
        aadharImage: data.documents?.aadharImage || "",
        panImage: data.documents?.panImage || "",
        vehicleTypes: data.vehicleTypes?.join(", ") || "",
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
        locationLat: data.location?.lat?.toString() || "",
        locationLng: data.location?.lng?.toString() || "",
      });
    }
  }, [data, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Transform form data to match your model structure
      const drivingData = {
        licenseNumber: values.licenseNumber,
        licenseExpiry: values.licenseExpiry,
        experience: values.experience,
        driverImage: values.driverImage || undefined,
        hourlyRate: values.hourlyRate,
        vehicleTypes: values.vehicleTypes ? values.vehicleTypes.split(",").map(t => t.trim()) : [],
        isAvailable: values.isAvailable,
        documents: {
          licenseImageFront: values.licenseImageFront || "",
          licenseImageBack: values.licenseImageBack || "",
          aadharImage: values.aadharImage || "",
          panImage: values.panImage || "",
        },
        location: {
          lat: parseFloat(values.locationLat) || 0,
          lng: parseFloat(values.locationLng) || 0,
        },
      };

      const result = await onSave(drivingData);
      
      if (result.success) {
        console.log("Driving information updated successfully");
        // You can show a success toast here
      } else {
        console.error("Failed to update driving information:", result.error);
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
            name="licenseExpiry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Expiry *</FormLabel>
                <FormControl>
                  <DatePicker 
                    date={field.value} 
                    onSelect={field.onChange}
                    placeholder="Select expiry date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience (years) *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 5" {...field} />
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
            name="driverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/driver.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="locationLat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="Latitude" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationLng"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input type="number" step="any" placeholder="Longitude" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="licenseImageFront"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License (Front) URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/license-front.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licenseImageBack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License (Back) URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/license-back.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aadharImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhar Card URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/aadhar.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="panImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN Card URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/pan.png" {...field} />
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
