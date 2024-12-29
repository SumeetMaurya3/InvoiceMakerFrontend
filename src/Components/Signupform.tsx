import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function Signupform() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/signup`, values);
      console.log("User registered successfully:", response.data);
  
      toast.success("Signup successful!", {
        position: "top-right",
      });
    } catch (error: any) {
      console.error("Signup failed:", error.response?.data || error.message);
  
      toast.error(error.response?.data?.message || "An error occurred during signup.", {
        position: "top-right",
      });
    }
  }
  

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} className="py-6 bg-[#27272a] border-[#404040]" />
              </FormControl>
              <FormDescription>
                This name will be displayed with your inquiry.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email ID" {...field} className="py-6 bg-[#27272a] border-[#404040]" />
              </FormControl>
              <FormDescription>
                This email will be displayed with your inquiry.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter the password"
                  {...field}
                  className="py-6 bg-[#27272a] border-[#404040]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit"  className="bg-[#44403c] text-[#a3e635]">Register</Button>
      </form>
    </Form>
    <ToastContainer />
    </>
  );
}
