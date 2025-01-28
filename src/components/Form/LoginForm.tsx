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
import TogglePasswordVisibility from "./TogglePassword";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUserAction } from "@/action/user.action";
import { useEffect } from "react";
import { Input } from "../ui/input";

// Define schema with zod
const formSchema = z.object({
  email_phone: z
    .string()
    .min(1, "Email or phone is required")
    .trim(),
  password: z
    .string()
    .min(1, "Password is required")
    .trim(),
});

// Infer TypeScript types from schema
type TForm = z.infer<typeof formSchema>;

function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where the user was navigating from
  const fromLocation = location?.state?.from?.pathname || location.pathname || "/";

  // Access user state from Redux store
  const { user } = useAppSelector((state) => state.userInfo);

  // Password visibility toggle
  const { ToggleVisibility, type } = TogglePasswordVisibility();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<TForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_phone: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: TForm) => {
    await dispatch(loginUserAction(values, navigate));
  };

  // Auto-login redirection if user is already logged in
  useEffect(() => {
    if (user?._id) {
      navigate(fromLocation, { replace: true });
    }
  }, [user?._id, fromLocation, navigate]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col w-full"
      >
        {/* Email or Phone Field */}
        <FormField
          control={form.control}
          name="email_phone"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-lg text-black">Email or Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="john@xyz.com | 04563289561"
                  {...field}
                  className="bg-white w-full rounded-lg border-primary text-base" // Apply font size here
                  type="text"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full relative">
              <FormLabel className="text-lg text-black">Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="***********"
                  {...field}
                  className="bg-white rounded-lg border-primary focus:outline-primary/80 text-base" // Apply font size here
                  type={type}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
              {ToggleVisibility}
            </FormItem>
          )}
        />

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link className="text-right hover:underline" to="/forgot-password">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="bg-primary rounded-full text-white hover:bg-primary/80"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
