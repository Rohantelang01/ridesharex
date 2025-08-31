
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

const formSchema = z.object({
    licenseNumber: z.string(),
    licenseExpiry: z.date(),
    experience: z.coerce.number(),
    driverImage: z.string().url(),
    hourlyRate: z.coerce.number(),
    licenseImageFront: z.string().url(),
    licenseImageBack: z.string().url(),
    aadharImage: z.string().url(),
    panImage: z.string().url(),
});

const DrivingInformationForm = () => {
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
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
                <FormLabel>License Number</FormLabel>
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
                <FormLabel>License Expiry</FormLabel>
                <FormControl>
                  <DatePicker />
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
                <FormLabel>Experience (years)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 5" {...field} />
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
            name="hourlyRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 250" {...field} />
                </FormControl>
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default DrivingInformationForm;
