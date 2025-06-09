"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Loader2 } from "lucide-react";
import Link from "next/link";

// Infer the form type from the Zod schema
type SignUpFormValues = z.infer<typeof SignUpSchema>;

const Page = () => {
  const [username, setUsername] = useState<string>("");
  // TODO: make it object
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const { replace: redirect } = useRouter();

  // zod implementation
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    (async () => {
      if (!username) return;

      setIsCheckingUsername(true);
      setUsernameMessage("");

      try {
        const { data: res } = await axios.get(
          `/api/check-username-unique?username=${username}`
        );
        setUsernameMessage(res.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error checking username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    })();

    //
  }, [username]);

  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);

    try {
      const { data: res } = await axios.post<ApiResponse>("/api/signup", data);
      toast("Success", {
        description: res.message,
      });

      redirect(`/verify/${username}`);

      //
    } catch (error) {
      console.log("Error is signin of user: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error("Error", {
        description: errorMessage,
      });

      //
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <Loader2
                      className="
                        animate-spin
                        "
                    />
                  )}
                  <p
                    className={`text-sm ${
                      usernameMessage === "username is available"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 w-4 animate-spin" /> Signing up...
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>

        <div>
          <p>
            Already a member?{" "}
            <Link href="/signin" className="text-blue-600 hover:text-blue-800">
              Signin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
