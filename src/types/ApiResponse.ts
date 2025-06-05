import { Message } from "@/model/Message";
import { email } from "./../../node_modules/zod/dist/esm/v4/classic/schemas";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
) {}
