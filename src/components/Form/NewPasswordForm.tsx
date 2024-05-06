import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TogglePasswordVisibility from "./TogglePassword";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { updateForgetPassword } from '@/action/user.action';

const NewPasswordForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {email_Phone} = useAppSelector(state => state.userInfor)

    const formSchema = z.object({
        email_phone: z.string(),
        confirmPassword: z.string({
          required_error: "Password is required",
          invalid_type_error: "Password must be a string",
        })
        .min(3, { message: "At least 3 characters required" })
        .max(15, { message: "Name must not be more than 15 characters" }),
      
        password:  z.string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
          })
          .min(3, { message: "At least 3 characters required" })
          .max(15, { message: "Name must not be more than 15 characters" }),
      });
      
      type TForm = z.infer<typeof formSchema>;

    const { ToggleVisibility, type } = TogglePasswordVisibility();
    const form = useForm<TForm>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email_phone: email_Phone,
        confirmPassword: "",
        password: "",
      },
    });
  
    async function onSubmit(values: z.infer<typeof formSchema>) {

        const { confirmPassword, password, email_phone} = values;
    if (confirmPassword !== password) {
      window.alert("Password do not match //todo create a new window");
      return;
    }
    await dispatch(updateForgetPassword({email_phone, password})) && navigate('/sign-in')
        console.log(values)      
    }

  return (
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 flex flex-col w-full"
    >
      
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="w-full relative">
            <FormLabel className=" text-lg text-black">Enter New Password</FormLabel>
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

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="w-full relative">
            <FormLabel className=" text-lg text-black">Enter Confirm Password</FormLabel>
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

      <Button
        type="submit"
        className="bg-red-600 rounded-full text-white hover:bg-red-800"
      >
        Submit
      </Button>
    </form>
  </Form>
  )
}

export default NewPasswordForm