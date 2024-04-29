"use client"
import { z } from "zod"
import { useForm  } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInUserAxios } from "@/helper/axiosHelper/userAxios/userAxios"
const formSchema = z.object({
  email_phone: z.string().min(2).max(50),
  password:z.string().min(3,{
    message:'First name should be at least 3 characters'
  }).max(15 ,{message:'First name should not be more than 10 characters'})
})

const SignIn = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_phone: "",
      password:"",
    },  
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {

    const resp = await signInUserAxios(values)
    console.log(resp)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 p-2 space-y-8 w-1/2 mx-auto border-lg shadow-lg border-black">
        <FormField 
          control={form.control}
          name="email_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Phone</FormLabel>
              <FormControl>
                <Input placeholder="Enter email or phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>

        <div className="text-end">
          Don't have an account? <a className="underline" href="sign-up">sign up here</a>
        </div>
      </form>
    </Form>
  )
}

export default SignIn
