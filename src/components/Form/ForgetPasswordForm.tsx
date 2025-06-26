import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppDispatch } from "@/hooks";
import { forgetPasswordOTPRequest } from "@/action/user.action";
import { useNavigate } from "react-router";

const formSchema = z.object({
  email_phone: z.string({
    required_error: "Email or phone is required",
  }),
});
type TForm = z.infer<typeof formSchema>;

const ForgetPasswordForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const form = useForm<TForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {

    (await dispatch(forgetPasswordOTPRequest(values))) &&
      navigate("/otp-verify");
    return
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
              <FormLabel className=" text-lg text-black">
                Email or Phone
              </FormLabel>
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
        <Button
          type="submit"
          className="bg-primary text-white hover:bg-red-800"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ForgetPasswordForm;
