"use client";

import { Message } from "@/model/Message";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

  const handleDeleteMessageDelete = (messageId: string) => {
    setMessages(messages.filter((message) => message?._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessage = watch("acceptMessage");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const { data: res } = await axios.get("/api/accept-messages");
      setValue("acceptMessages", res?.isAcceptingMessages);

      //
    } catch (error) {
      const { response } = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description:
          response?.data.message || "Failed to fetch message setting",
      });
    } finally {
      setIsSwitchLoading(false);
    }

    //
  }, [setValue]);

  //
  return <div>page</div>;
}
