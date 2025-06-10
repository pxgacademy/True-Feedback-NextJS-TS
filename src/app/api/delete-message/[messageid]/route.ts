import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const { messageid } = params;
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session?.user)
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );

  const user: User = session?.user as User;
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const updateResult = await UserModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageid } } }
    );

    if (updateResult.modifiedCount == 0)
      return Response.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );

    return Response.json(
      { success: true, message: "Message deleted" },
      { status: 200 }
    );

    // eslint-disable-next-line
  } catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
