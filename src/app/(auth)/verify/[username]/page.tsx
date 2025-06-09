"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VerifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Infer the form type from the Zod schema
type VerifyFormValues = z.infer<typeof VerifySchema>;

function VerifyAccount() {
  const { replace: redirect } = useRouter();
  const { username } = useParams<{ username: string }>();

  // zod implementation
  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(VerifySchema),
  });

  const onSubmit = async ({ code }: VerifyFormValues) => {
    try {
      const { data: res } = await axios.post("/api/verify-code", {
        username: username,
        code,
      });

      toast("Success", { description: res?.message });
      redirect("signin");

      //
    } catch (error) {
      console.log("Error is verify ui: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: axiosError.response?.data.message,
      });

      toast.error("Error", { description: axiosError.response?.data.message });

      //
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Code */}
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="enter your code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default VerifyAccount;
