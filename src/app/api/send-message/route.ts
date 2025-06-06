import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "./../../../model/Message";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();
    const user = await UserModel.findOne({ username });

    if (!user)
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    // if user not accepting the message
    else if (!user?.isAcceptingMessage)
      return Response.json(
        { success: false, message: "User is not accepting the messages" },
        { status: 403 }
      );

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { success: true, message: "message sent successfully" },
      { status: 200 }
    );

    // eslint-disable-next-line
  } catch (error: any) {
    console.log("Error sending messages: ", error);
    return Response.json(
      { success: false, message: error?.message },
      { status: 500 }
    );
  }
}
