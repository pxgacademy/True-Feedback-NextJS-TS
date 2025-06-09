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
  const { replace } = useRouter();
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
      replace("signin");

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

  return <div>VerifyAccount</div>;
}

export default VerifyAccount;
