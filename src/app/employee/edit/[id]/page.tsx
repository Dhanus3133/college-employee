"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email(),
  mobile: z.string().min(9, {
    message: "It must be 10 digits",
  }),
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }),
});

type params = {
  id: string;
};

export default function EditProfileForm() {
  const router = useRouter();
  const params: params = useParams();
  const { data, isLoading } = api.employee.get.useQuery({
    id: Number(params.id),
  });

  useEffect(() => {
    if (data) {
      form.setValue("name", data.name);
      form.setValue("email", data.email);
      form.setValue("department", data.department);
      form.setValue("mobile", data?.mobile || "");
    }
  }, [data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
      email: data?.email || "",
      department: data?.department || "",
      mobile: data?.mobile || "",
    },
  });

  const utils = api.useUtils();

  const updateEmployee = api.employee.edit.useMutation({
    onSuccess: () => {
      utils.employee.list.invalidate();
      router.push("/");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateEmployee.mutate({
      id: Number(params.id),
      name: values.name,
      email: values.email,
      department: values.department,
      mobile: values.mobile,
    });
    router.push("/");
  }

  return (
    <div className="mx-auto w-11/12 pt-8">
      <h3 className="pb-4">Edit Employee form</h3>
      {!isLoading ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jessica" {...field} />
                  </FormControl>
                  <FormDescription>This is your Employee name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jessica@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your Employee email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Data Analyst" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your Employee department.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="6969696969" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your Employee mobile number.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
