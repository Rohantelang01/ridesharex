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

// Schema aligned with your User model
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().min(18, { message: "You must be at least 18 years old." }),
  gender: z.enum(["male", "female", "other"]),
  profileImage: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  // Home Address
  homeLocationStreet: z.string().optional(),
  homeLocationCity: z.string().optional(),
  homeLocationState: z.string().optional(),
  homeLocationPincode: z.string().regex(/^\d{6}$/, { message: "Pincode must be 6 digits." }).optional().or(z.literal("")),
  homeLocationCountry: z.string().default("India"),
  homeLocationLat: z.coerce.number().min(-90).max(90).optional(),
  homeLocationLng: z.coerce.number().min(-180).max(180).optional(),
  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().regex(/^[6-9]\d{9}$/, { message: "Please enter a valid Indian phone number." }).optional().or(z.literal("")),
});

interface PersonalInformationFormProps {
  data?: {
    name?: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    profileImage?: string;
    emergencyContact?: {
      name?: string;
      phone?: string;
    };
    address?: {
      homeLocation?: {
        street?: string;
        city?: string;
        state?: string;
        pincode?: string;
        country?: string;
        location?: {
          lat: number;
          lng: number;
        };
      };
    };
  };
  onSave: (data: any) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const PersonalInformationForm = ({ data, onSave, isLoading }: PersonalInformationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 18,
      gender: "male",
      profileImage: "",
      homeLocationStreet: "",
      homeLocationCity: "",
      homeLocationState: "",
      homeLocationPincode: "",
      homeLocationCountry: "India",
      homeLocationLat: undefined,
      homeLocationLng: undefined,
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        age: data.age || 18,
        gender: data.gender || "male",
        profileImage: data.profileImage || "",
        homeLocationStreet: data.address?.homeLocation?.street || "",
        homeLocationCity: data.address?.homeLocation?.city || "",
        homeLocationState: data.address?.homeLocation?.state || "",
        homeLocationPincode: data.address?.homeLocation?.pincode || "",
        homeLocationCountry: data.address?.homeLocation?.country || "India",
        homeLocationLat: data.address?.homeLocation?.location?.lat,
        homeLocationLng: data.address?.homeLocation?.location?.lng,
        emergencyContactName: data.emergencyContact?.name || "",
        emergencyContactPhone: data.emergencyContact?.phone || "",
      });
    }
  }, [data, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Transform form data to match your model structure
      const personalData = {
        name: values.name,
        age: values.age,
        gender: values.gender,
        profileImage: values.profileImage || undefined,
        emergencyContact: (values.emergencyContactName || values.emergencyContactPhone) ? {
          name: values.emergencyContactName,
          phone: values.emergencyContactPhone,
        } : undefined,
        address: {
          homeLocation: (values.homeLocationStreet || values.homeLocationCity || values.homeLocationState || values.homeLocationPincode) ? {
            street: values.homeLocationStreet,
            city: values.homeLocationCity,
            state: values.homeLocationState,
            pincode: values.homeLocationPincode,
            country: values.homeLocationCountry,
            location: (values.homeLocationLat && values.homeLocationLng) ? {
              lat: values.homeLocationLat,
              lng: values.homeLocationLng,
            } : { lat: 0, lng: 0 } // Default coordinates if not provided
          } : undefined
        }
      };

      const result = await onSave(personalData);
      
      if (result.success) {
        console.log("Personal information updated successfully");
        // You can show a success toast here
      } else {
        console.error("Failed to update personal information:", result.error);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Your Age" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profileImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Home Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="homeLocationStreet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="Street Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="homeLocationCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="homeLocationState"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="homeLocationPincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input placeholder="6-digit Pincode" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="homeLocationLat"
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
              name="homeLocationLng"
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
          <h3 className="text-lg font-medium">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="emergencyContactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Emergency Contact Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Emergency Contact Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting || isLoading}
          className="w-full md:w-auto"
        >
          {isSubmitting || isLoading ? "Saving..." : "Save Personal Information"}
        </Button>
      </form>
    </Form>
  );
};

export default PersonalInformationForm;