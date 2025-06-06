import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session?.user)
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );

  const user: User = session?.user as User;
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      {
        userId,
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser)
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        { status: 401 }
      );

    return Response.json(
      {
        success: true,
        message: "Message acceptance status update successfully",
      },
      { status: 200 }
    );

    //
  } catch (error) {
    console.log("failed to update user status to accept messages: ", error);
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

// TODO: if needed- GET(request: Request)

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session?.user)
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );

  const user: User = session?.user as User;
  const userId = user._id;

  try {
    const foundedUser = await UserModel.findById(userId);

    if (!foundedUser)
      return Response.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    return Response.json(
      {
        success: true,
        message: "User found",
        isAcceptingMessages: foundedUser.isAcceptingMessage,
      },
      { status: 200 }
    );

    //
  } catch (error) {
    console.log("Error is getting message acceptance status: ", error);
    return Response.json(
      {
        success: false,
        message: "Error is getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
