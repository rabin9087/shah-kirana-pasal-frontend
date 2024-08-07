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
import TogglePasswordVisibility from "./TogglePassword";
import { useAppDispatch } from "@/hooks";
import { createNewAdmin, createNewUser } from "@/action/user.action";
import { useNavigate } from "react-router";
import { createUserParams } from "@/types";

const formSchema = z.object({
  fName: z
    .string({
      required_error: "First Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(3, { message: "At least 3 characters required" })
    .max(15, { message: "Name must not be more than 15 characters" }),
  lName: z
    .string({
      required_error: "Last Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(3, { message: "At least 3 characters required" })
    .max(15, { message: "Last Name must not be more than 15 characters" }),
  email: z
    .string()
    .optional(),
  phone: z.string({
    required_error: "Phone number is required",
    invalid_type_error: "Name must be a string",
  }).length(10),
  password: z.string({
    required_error: "First Name is required",
    invalid_type_error: "Name must be a string",
  })
    .min(3, { message: "At least 3 characters required" })
    .max(15, { message: "Name must not be more than 15 characters" }),
  confirmPassword: z.string({
    required_error: "First Name is required",
    invalid_type_error: "Name must be a string",
  })
    .min(3, { message: "At least 3 characters required" })
    .max(15, { message: "Name must not be more than 15 characters" }),
});

type TForm = z.infer<typeof formSchema>;
function SignUpForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { ToggleVisibility, type } = TogglePasswordVisibility();
  const form = useForm<TForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fName: "",
      confirmPassword: "",
      email: "",
      lName: "",
      password: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let result: boolean;
    const { confirmPassword, password, ...rest } = values;
    if (confirmPassword !== password) {
      window.alert("Password do not match //todo create a new window");
      return;
    }

    if (!token) {
      result = Boolean(await dispatch(createNewUser({ ...rest, password } as createUserParams)));
    } else {
      result = Boolean(await dispatch(createNewAdmin({ ...rest, password } as createUserParams)));
    }
    if (result) {
      navigate("/sign-in");
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col gap-2"
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

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className=" text-lg text-white">Last Name </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Last name"
                    {...field}
                    className="sign-input"
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
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
                <FormLabel className=" text-lg text-white">Email <span>(optional)</span></FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@xyz.com"
                    {...field}
                    className="sign-input"
                    type="email"
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
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
                    placeholder="Enter your mobile number"
                    {...field}
                    className="sign-input"
                    type="number"
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-5 justify-between flex-col">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full relative">
                <FormLabel className=" text-lg text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="***********"
                    {...field}
                    className="sign-input"
                    type={type}
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
                {ToggleVisibility}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full relative">
                <FormLabel className=" text-lg text-white">
                  Confrim Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="************"
                    {...field}
                    className="sign-input"
                    type={type}
                  />
                </FormControl>

                <FormMessage className="text-red-500" />
                {ToggleVisibility}
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="bg-red-600 rounded-full text-white hover:bg-red-800"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default SignUpForm;
