"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { X } from "lucide-react";
import { Message } from "@/model/Message";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

interface MessageCardProps {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  //
  const handleMessageConfirm = async () => {
    const { data: res } = await axios.delete<ApiResponse>(
      `/api/delete-message/${message?._id}`
    );
    toast("Success", { description: res.message });
    onMessageDelete(message?._id as string);
  };

  //
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>

        {/* alert functionalities started */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <X className="size-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleMessageConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* alert functionalities ended */}

        <CardDescription></CardDescription>
      </CardHeader>
    </Card>
  );
}
