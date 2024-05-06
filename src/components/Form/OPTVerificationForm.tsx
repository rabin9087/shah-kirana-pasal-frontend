import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { OTPVerificationRequest } from '@/action/user.action';

const OPTVerificationForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {email_Phone} = useAppSelector(state => state.userInfor)

    const formSchema = z.object({
        email_phone: z.string(),
        otp: z
          .string({
            required_error: "otp is required",
          }).length(6, {message: "otp must be 6 digit code"}),
      });
      
      type TForm = z.infer<typeof formSchema>;

    const form = useForm<TForm>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email_phone: email_Phone,
        otp: "",
            },
    });
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values)
      await dispatch(OTPVerificationRequest(values)) && navigate('/new-password')
    }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col w-full"
      >
        
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className=" text-lg text-black">Enter opt code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Six digit opt code"
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
          className="bg-red-600 rounded-full text-white hover:bg-red-800"
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default OPTVerificationForm