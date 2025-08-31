
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
import DrivingInformationForm from "./DrivingInformationForm";

const formSchema = z.object({
  vehicleTypes: z.string(), 
  kmRate: z.record(z.coerce.number()),
  canDriveSelf: z.boolean(),
});

const VehicleInformationForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleTypes: "",
      kmRate: {},
      canDriveSelf: false,
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
            name="kmRate.default"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Rate per KM</FormLabel>
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
              </div>
            </FormItem>
          )}
        />
        {form.watch("canDriveSelf") && <DrivingInformationForm />}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default VehicleInformationForm;
