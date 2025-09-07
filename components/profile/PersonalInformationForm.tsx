
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
import { useEffect, useState } from "react";
import { IUser } from "@/types/profile";

// Schema aligned with your new IUser model
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().min(18, { message: "You must be at least 18 years old." }),
  profileImage: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  // Permanent Address
  addressLine1: z.string().min(5, { message: "Address line 1 is required." }),
  addressLine2: z.string().optional(),
  village: z.string().optional(),
  tehsil: z.string().optional(),
  district: z.string().min(2, { message: "District is required." }),
  state: z.string().min(2, { message: "State is required." }),
  pincode: z.string().regex(/^\d{6}$/, { message: "Pincode must be 6 digits." }),
});

interface PersonalInformationFormProps {
  data?: IUser;
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
      profileImage: "",
      addressLine1: "",
      addressLine2: "",
      village: "",
      tehsil: "",
      district: "",
      state: "",
      pincode: "",
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        age: data.age || 18,
        profileImage: data.profileImage || "",
        addressLine1: data.permanentAddress?.addressLine1 || "",
        addressLine2: data.permanentAddress?.addressLine2 || "",
        village: data.permanentAddress?.village || "",
        tehsil: data.permanentAddress?.tehsil || "",
        district: data.permanentAddress?.district || "",
        state: data.permanentAddress?.state || "",
        pincode: data.permanentAddress?.pincode || "",
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
        profileImage: values.profileImage || undefined,
        permanentAddress: {
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          village: values.village,
          tehsil: values.tehsil,
          district: values.district,
          state: values.state,
          pincode: values.pincode,
        }
      };

      const result = await onSave(personalData);
      
      if (result.success) {
        console.log("Personal information updated successfully");
      } else {
        console.error("Failed to update personal information:", result.error);
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
            name="profileImage"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
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
          <h3 className="text-lg font-medium">Permanent Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address Line 1 *</FormLabel>
                  <FormControl>
                    <Input placeholder="House No, Street Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Apartment, suite, etc. (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="village"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Village/Town</FormLabel>
                  <FormControl>
                    <Input placeholder="Village or Town" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tehsil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tehsil</FormLabel>
                  <FormControl>
                    <Input placeholder="Tehsil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District *</FormLabel>
                  <FormControl>
                    <Input placeholder="District" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State *</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode *</FormLabel>
                  <FormControl>
                    <Input placeholder="6-digit Pincode" {...field} />
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
            {isSubmitting || isLoading ? "Saving..." : "Save Personal Information"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PersonalInformationForm;
