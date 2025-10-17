"use server";

import { prisma } from "@/lib/prisma";

// export const createUser = async () => {
//   try {

//     const existingUser = await prisma.user.findUnique({
//       where: {
//         email: email,
//       },
//     });

//     if (existingUser) {
//       return { error: "Email already in Use" };
//     }

//     const user = await prisma.user.create({
//       data: {
//         email: email,
//         name: "Akin Adejuwon",

//       },
//     });

//     if (!user) {
//       throw new Error();
//     }
//     return { success: "User created successfully", user };
//   } catch (error) {
//     return { error: "User not created" };
//   }
// };
