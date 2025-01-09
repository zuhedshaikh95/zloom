"use server";

import { db } from "@/libs/prisma";
import { currentUser } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";

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

export const inviteMemberToWorkspace = async (workspaceId: string, receiverId: string, email: string) => {
  try {
    console.log("inviteMemberToWorkspace called!");

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
            `Hey ${senderInfo.firstName} join my workspace at Zloom. Click accept to confirm`,
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
