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
import { Link, useNavigate } from "react-router-dom";
import { loginUserAction } from "@/action/user.action";

const formSchema = z.object({
  email_phone: z
    .string({
      required_error: "Email or phone is required",
    }),

  password: z.string({
    required_error: "Password is required",
  }),
});

type TForm = z.infer<typeof formSchema>;
function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { ToggleVisibility, type } = TogglePasswordVisibility();
  const form = useForm<TForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_phone: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await dispatch(loginUserAction(values, navigate));
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col w-full"
      >
        <FormField
          control={form.control}
          name="email_phone"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className=" text-lg text-black">Email or Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="john@xyz.com | 04563289561"
                  {...field}
                  className="bg-white w-full rounded-lg border-red-400"
                  type="text"
                />
              </FormControl>

              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full relative">
              <FormLabel className=" text-lg text-black">Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="***********"
                  {...field}
                  className="bg-white rounded-lg border-red-400 focus:outline-red-400"
                  type={type}
                />
              </FormControl>

              <FormMessage className="text-red-500" />
              {ToggleVisibility}
            </FormItem>
          )}
        />
        <div className="text-right">
          <Link className="text-right hover:underline" to={"/forgot-password"}>
            Forgot Password?
          </Link>
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

export default LoginForm;
