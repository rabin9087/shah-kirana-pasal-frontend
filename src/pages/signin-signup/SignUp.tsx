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
const formSchema = z.object({
    fName: z.string().min(2, {
        message:'First name should be at least 3 characters'
      }).max(30, {message:'First name should not be more than 25 characters'}),
    lName: z.string().min(2, {
        message:'First name should be at least 3 characters'
      }).max(30, {message:'First name should not be more than 25 characters'}),
    email: z.string().min(2, {message: "Email must contain @ characters"}).max(50),
    phone: z.string().min(10).max(15),
    password:z.string().min(3,).max(10,),

})
const SignUp = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          fName: "",
          lName: "",
          email: "",
          phone: "",
          password:''
        },  
      })
    
      function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5 p-2 space-y-8 w-1/2 mx-auto border-lg shadow-lg border-black">
    <FormField 
        control={form.control}
        name="fName"
        render={({ field }) => (
          <FormItem className="">
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter first Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="lName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter last Name" {...field} />
            </FormControl>
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
              <Input placeholder="Enter email address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField 
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input placeholder="Enter phone address" {...field} />
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
        Already got an account? <a className="underline" href="sign-in">sigin here</a>
      </div>
    </form>
  </Form>
  )
}

export default SignUp
