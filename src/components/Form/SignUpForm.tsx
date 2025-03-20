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
import { createUserParams } from "@/types/index";
import { toast } from "react-toastify";
import { useState } from "react";
import countryCodes from '../../utils/countryCodes.json'

const formSchema = z.object({
  fName: z
    .string()
    .min(3, "At least 3 characters required")
    .max(15, "Name must not exceed 15 characters"),
  lName: z
    .string()
    .min(3, "At least 3 characters required")
    .max(15, "Last Name must not exceed 15 characters"),
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .max(15, "Phone number must not be more than 15 digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
  confirmPassword: z
    .string()
    .min(6, "Confirm Password must be at least 6 characters")
    .max(20, "Confirm Password must not exceed 20 characters"),
  address: z
    .string(),
});

type TForm = z.infer<typeof formSchema>;

function SignUpForm({ token }: { token: string }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { ToggleVisibility: togglePassword, type: passwordType } =
    TogglePasswordVisibility();
  const {
    ToggleVisibility: toggleConfirmPassword,
    type: confirmPasswordType,
  } = TogglePasswordVisibility();
  const nepal = countryCodes.findIndex((item) => item.name === 'Nepal')
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[nepal] || {}); // Default to the first country

  const form = useForm<TForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fName: "",
      confirmPassword: "",
      email: "",
      lName: "",
      password: "",
      phone: "",
      address: "",
    },
  });
  async function onSubmit(values: TForm) {
    const { confirmPassword, password, phone, ...rest } = values;

    if (confirmPassword !== password) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const result = !token
      ? Boolean(await dispatch(createNewUser({ ...rest, phone: selectedCountry.dial_code + values.phone, password } as createUserParams)))
      : Boolean(await dispatch(createNewAdmin({ ...rest, phone: selectedCountry.dial_code + values.phone, password } as createUserParams)));

    if (result) {
      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/sign-in");
    } else {
      toast.error("Account creation failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex flex-col w-full"
      >
        <div className="flex gap-2 flex-row sm:flex-row">
          <FormField
            control={form.control}
            name="fName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-lg text-black">First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your first name"
                    {...field}
                    className="bg-white w-full rounded-lg border-primary"
                    type="text"
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
                <FormLabel className="text-lg text-black">Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your last name"
                    {...field}
                    className="bg-white w-full rounded-lg border-primary"
                    type="text"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 flex-row sm:flex-row">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-lg text-black">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@xyz.com"
                    {...field}
                    className="bg-white w-full rounded-lg border-primary"
                    type="text"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <FormLabel className="text-lg text-black">Phone Number</FormLabel>

        <select
          value={selectedCountry.dial_code} // Use dial_code for value
          onChange={(e) => {
            const selectedDialCode = e.target.value;
            const selectedCountryData = countryCodes.find(
              (country) => country.dial_code === selectedDialCode
            )
            setSelectedCountry(selectedCountryData || countryCodes[0]); // Default to first country if not found
          }}
          className="w-fit bg-white border border-gray-300 rounded-md px-2 py-1 mr-2"
        >
          {countryCodes.map((country) => (
            <option key={country.code} value={country.dial_code}>
              {country.name} {country.emoji} {country.dial_code}
            </option>
          ))}
        </select>
        
        <div className="flex gap-5 flex-col sm:flex-row">
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full relative">
                
                <FormControl>
                  <Input
                    placeholder="Enter your phone number"
                    {...field}
                    className="bg-white rounded-lg border-primary focus:outline-primary/80"
                    type={"text"}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-5 flex-col sm:flex-row">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full relative">
                <FormLabel className="text-lg text-black">Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your address"
                    {...field}
                    className="bg-white rounded-lg border-primary focus:outline-primary/80"
                    type={"text"}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-5 flex-col">
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
                    className="bg-white rounded-lg border-primary focus:outline-primary/80"
                    type={passwordType}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
                {togglePassword}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full relative">
                <FormLabel className="text-lg text-black">Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="***********"
                    {...field}
                    className="bg-white rounded-lg border-primary focus:outline-primary/80"
                    type={confirmPasswordType}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
                {toggleConfirmPassword}
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="bg-primary rounded-full text-white hover:bg-primary/80">

          Sign Up
        </Button>
      </form>
    </Form>
  );
}

export default SignUpForm;
