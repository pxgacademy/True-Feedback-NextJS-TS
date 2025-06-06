import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

// TODO: add it if needed. GET(request: Request)
export async function GET() {
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
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user?.length === 0)
      return Response.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    return Response.json(
      {
        success: true,
        message: "Got the messages",
        messages: user[0].messages,
      },
      { status: 200 }
    );

    // eslint-disable-next-line
  } catch (error: any) {
    console.log("Error getting messages: ", error);
    return Response.json(
      { success: false, message: error?.message },
      { status: 500 }
    );
  }
}
