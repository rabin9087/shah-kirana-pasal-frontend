import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
const formSchema = z.object({
  fName: z
    .string()
    .min(3, { message: "At least 3 characters required" })
    .max(15, { message: "Name must not be more than 15 characters" }),
  lName: z
    .string()
    .min(3, { message: "At least 3 characters required" })
    .max(15, { message: "Last Name must not be more than 15 characters" }),
  email: z.string(),
  phone: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
});
function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fName: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col gap-5"
      >
        <div className="flex gap-5 justify-between flex-col sm:flex-row">
          <FormField
            control={form.control}
            name="fName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className=" text-lg text-white">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    {...field}
                    className="sign-input"
                  />
                </FormControl>

                <FormMessage className="text-red-100" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className=" text-lg text-white">Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Last name"
                    {...field}
                    className="sign-input"
                  />
                </FormControl>

                <FormMessage className="text-red-100" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-5 justify-between flex-col sm:flex-row">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className=" text-lg text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@xyz.com"
                    {...field}
                    className="sign-input"
                  />
                </FormControl>

                <FormMessage className="text-red-100" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className=" text-lg text-white">Mobile</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    {...field}
                    className="sign-input"
                  />
                </FormControl>

                <FormMessage className="text-red-100" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-5 justify-between flex-col">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className=" text-lg text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="***********"
                    {...field}
                    className="sign-input"
                    type="password"
                  />
                </FormControl>

                <FormMessage className="text-red-100" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className=" text-lg text-white">
                  Confrim Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="************"
                    {...field}
                    className="sign-input"
                    type="password"
                  />
                </FormControl>

                <FormMessage className="text-red-100" />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="bg-green-600 rounded-full text-white">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
