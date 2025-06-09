"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SignUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

// Infer the form type from the Zod schema
type SignUpFormValues = z.infer<typeof SignUpSchema>;

const Page = () => {
  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const debouncedUsername = useDebounceValue(username, 300);
  const router = useRouter();

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
      if (!debouncedUsername) return;

      setIsCheckingUsername(true);
      setUsernameMessage("");

      try {
        const { data: res } = await axios.get(
          `/api/check-username-unique?username=${debouncedUsername}`
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
  }, [debouncedUsername]);

  return <div>page</div>;
};

export default Page;
