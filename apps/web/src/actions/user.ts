"use server";

import { db } from "@/libs/prisma";
import { currentUser } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";
import { stripe } from "@/libs/stripe";

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    to,
    subject,
    text,
    html,
  };

  return { mailOptions, transporter };
};

export const authenticateUser = async () => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };

    const userExists = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      include: {
        workspaces: {
          where: {
            user: {
              clerkId: user.id,
            },
          },
        },
      },
    });

    if (userExists) return { status: 200, user: userExists };

    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.imageUrl,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspaces: {
          create: {
            name: `${user.firstName}'s Workspace`,
            type: "PERSONAL",
          },
        },
      },
      include: {
        workspaces: {
          where: {
            user: {
              clerkId: user.id,
            },
          },
        },
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (newUser) return { status: 201, user: newUser };

    return { status: 400 };
  } catch (error: any) {
    console.error("🔴 authenticateUser Error:", error.message);
    return { status: 500 };
  }
};

export const getNotifications = async () => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404, notifications: null };

    const notifications = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        notifications: true,
        _count: {
          select: {
            notifications: true,
          },
        },
      },
    });

    if (notifications) {
      return { status: 200, notifications };
    }

    return { status: 404, notifications: null };
  } catch (error) {
    return { status: 400, notifications: null };
  }
};

export const searchUsers = async (query?: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404, users: [] };

    const users = await db.user.findMany({
      where: {
        OR: [{ firstName: { contains: query } }, { email: { contains: query } }, { lastName: { contains: query } }],
        NOT: [{ clerkId: user.id }],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        firstName: true,
        lastName: true,
        image: true,
        email: true,
      },
    });

    return { status: 200, users };
  } catch (error: any) {
    console.log("🔴 searchUsers Error:", error.message);
    return { status: 500, users: [] };
  }
};

export const getUserProfile = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: false, user: null };

    const profileIdAndImage = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        image: true,
        id: true,
      },
    });

    return { status: !!profileIdAndImage, user: profileIdAndImage };
  } catch (error: any) {
    console.log("🔴 getUserProfile Error:", error.message);
    return { status: false, user: null };
  }
};

export const getVideoComments = async (videoId: string) => {
  try {
    const comments = await db.comment.findMany({
      where: {
        OR: [{ videoId }, { commentId: videoId }],
        commentId: null,
      },
      include: {
        replies: {
          include: {
            user: true,
          },
        },
        user: true,
      },
    });

    if (comments) return { status: true, comments: comments };

    return { status: true, comments: [] };
  } catch (error: any) {
    console.log("🔴 getVideoComments Error:", error.message);
    return { status: false, comments: [] };
  }
};

export const getPaymentInfo = async () => {
  try {
    const user = await currentUser();

    if (!user) return { status: false, payment: null };

    const payment = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    return { status: !!payment, payment };
  } catch (error: any) {
    console.log("🔴 getPaymentInfo Error:", error.message);
    return { status: false, payment: null };
  }
};

export const getFirstView = async () => {
  try {
    const user = await currentUser();

    if (!user) return { status: false };

    const data = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        firstView: true,
      },
    });

    return { status: !!data, view: !!data?.firstView };
  } catch (error: any) {
    console.log("🔴 getFirstView Error:", error.message);
    return { status: false };
  }
};

export const enableFirstView = async (enabled: boolean) => {
  try {
    const user = await currentUser();

    if (!user) return { status: false, view: null };

    const data = await db.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        firstView: enabled,
      },
    });

    if (data.firstView) {
      return { status: !!data, message: "You will be notified on every view of your recordings", view: data };
    }

    return { status: !!data, message: "Notifications have been turned off ", view: data };
  } catch (error: any) {
    console.log("🔴 enableFirstView Error:", error.message);
    return { status: false, view: null };
  }
};

export const postCommentAndReply = async ({
  commentText,
  userId,
  videoId,
  commentId,
}: {
  userId: string;
  commentText: string;
  videoId: string;
  commentId?: string;
}) => {
  try {
    if (commentId) {
      const reply = await db.comment.update({
        where: {
          id: commentId,
        },
        data: {
          replies: {
            create: {
              commentText,
              userId,
              videoId,
            },
          },
        },
      });

      if (reply) {
        return { status: true, message: "Reply posted!" };
      }
    }

    const comment = await db.video.update({
      where: {
        id: videoId,
      },
      data: {
        comments: {
          create: {
            commentText,
            userId,
          },
        },
      },
    });

    return { status: true, message: "Comment posted!" };
  } catch (error: any) {
    console.log("🔴 postCommentAndReply Error:", error.message);
    return { status: false, message: error.message };
  }
};

export const inviteMemberToWorkspace = async (workspaceId: string, receiverId: string, email: string) => {
  try {
    const user = await currentUser();

    if (!user) return { status: false, message: "Unauthorized!" };

    const senderInfo = await db.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        id: true,
        firstName: true,
      },
    });

    if (senderInfo) {
      const workspace = await db.workSpace.findUnique({
        where: {
          id: workspaceId,
        },
        select: {
          name: true,
        },
      });

      if (workspace) {
        const invitation = await db.invite.create({
          data: {
            senderId: senderInfo.id,
            receiverId,
            workspaceId,
            content: `You are invited to join ${workspace.name}, click accept to confirm`,
          },
          select: {
            id: true,
          },
        });

        await db.user.update({
          where: {
            clerkId: user.id,
          },
          data: {
            notifications: {
              create: {
                content: `${user.firstName} ${user.lastName} invited ${senderInfo.firstName} into ${workspace.name}`,
              },
            },
          },
        });

        if (invitation) {
          const { mailOptions, transporter } = await sendEmail(
            email,
            "Zloom - Workspace Invitation",
            `Hey ${senderInfo.firstName} join my workspace at Zloom and let's create record some moments. Click accept to confirm`,
            `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`
          );

          transporter.sendMail(mailOptions, async (error, data) => {
            if (error) {
              throw new Error(error.message);
            }

            console.log("Email sent ✅");
          });

          return { status: true, message: "Invititaion has been sent!" };
        }

        return { status: false, message: "Invitation not created!" };
      }

      return { status: false, message: "Workspace not found!" };
    }

    return { status: false, message: "Recipient not found!" };
  } catch (error: any) {
    console.log("🔴 inviteMemberToWorkspace Error:", error.message);
    return { status: false, message: error.message };
  }
};

export const acceptInvite = async (inviteId: string) => {
  try {
    const user = await currentUser();

    if (!user) return { status: false, message: "Unauthorized!", code: 404 };

    const invitation = await db.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        workspaceId: true,
        reciever: {
          select: {
            clerkId: true,
          },
        },
      },
    });

    if (user.id !== invitation?.reciever?.clerkId) return { status: false, message: "Unauthorized access!", code: 401 };

    const acceptInvite = db.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        accepted: true,
      },
    });

    const updateMember = db.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        members: {
          create: {
            workspaceId: invitation.workspaceId,
          },
        },
      },
    });

    const memberTransaction = await db.$transaction([acceptInvite, updateMember]);

    if (memberTransaction.length) return { status: true, message: "Invite accepted!", code: 200 };

    return { status: false, message: "Transaction failed!", code: 400 };
  } catch (error: any) {
    console.log("🔴 acceptInvite Error:", error.message);
    return { status: false, message: error.message, code: 500 };
  }
};

export const completeSubscription = async (session_id: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: false, message: "Unauthorized!" };

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session) {
      const customer = await db.user.update({
        where: {
          clerkId: user.id,
        },
        data: {
          subscription: {
            update: {
              data: {
                customerId: session.customer as string,
                plan: "PRO",
              },
            },
          },
        },
      });

      return { status: true, message: "Subscribed to Pro! Have fun recording more videos" };
    }

    return { status: false, message: "Invalid checkout session!" };
  } catch (error: any) {
    console.log("🔴 completeSubscription Error:", error.message);
    return { status: false, message: error.message };
  }
};
