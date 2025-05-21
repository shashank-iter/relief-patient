"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Shield } from "lucide-react";
import { clientPost } from "@/utils/clientApi";
import toast from "react-hot-toast";

// Define Zod schema for form validation
const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  role: z.enum(["patient"]),
});

const LoginForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with Zod resolver
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
      role: "patient",
    },
  });

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    setIsSubmitting(true);
    try {
      const res = await clientPost("/users/login", data);
      console.log("Login response:", res);
      toast.success("Login successful");
      // Handle successful login
    } catch (e) {
      console.log("Error:", e);
      toast.error("Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header with wave */}
        <div className="relative bg-blue-500 pt-16 pb-10">
          <div className="text-center text-white text-2xl font-medium mb-6">
            Relief
          </div>
          <div className="text-center text-white text-base font-medium mb-6">
            Emergency Response and Tracking System
          </div>
        </div>

        {/* Content area */}
        <div className="bg-white flex-1 px-6 pt-6 pb-6">
          {/* Patient Login button */}
          <Button className="w-full mb-6">Patient Login</Button>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Phone Number Field */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Phone Number
                </label>
                <div className="flex ">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            type={"number"}
                            onWheel={(e) => e.target.blur()}
                            onKeyDown={(e) =>
                              ["e", "E", "+", "-", "."].includes(e.key) &&
                              e.preventDefault()
                            }
                            className=""
                            placeholder="Enter 10-digit phone number"
                            {...field}
                            maxLength={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm text-gray-600">
                    Login Password
                  </label>
                  <a href="#" className="text-xs text-gray-500">
                    Forgot your password?
                  </a>
                </div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter password"
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in" : "Login"}
              </Button>

              {/* Register Link */}
              <div className="text-center text-sm mt-4">
                Don't have an account?{" "}
                <a href="#" className="text-blue-500">
                  Register
                </a>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
