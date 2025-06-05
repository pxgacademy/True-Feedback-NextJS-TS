import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { UsernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: UsernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // TODO: validate with zod

    //
  } catch (error) {
    console.log("Error checking username: ", error);
    return Response.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}
