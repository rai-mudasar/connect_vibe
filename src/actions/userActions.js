"use server";

import bcryptjs from "bcryptjs";
import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import sendEmailToUser from "@/helpers/sendEmail";
import { connection } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { deleteFromCloudinary, uploadToCloudinary } from "@/helpers/Cloudinary";

export async function getSessionUser() {
  const [_, session] = await Promise.all([
    connectToDb(),
    getServerSession(authOptions),
  ])
  if (!session || !session.user) throw new Error("Unauthorized! You must logged In to perform such operation.");
  return session.user;
}

export async function updateLastSeenAction(userId) {
  try {
    if (!userId) return { success: false };

    await userModel.findByIdAndUpdate(userId, {
      lastSeen: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating last seen timestamp:", error);
    return { success: false };
  }
}

export async function createNewPassword(userId, newPassword) {

  try {
    await connectToDb();

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        verificationOtp: null,
        verificationOtpExpiry: null
      },
      { new: true }
    )
      .lean()

    return {
      success: true,
      message: "Password changed Successfully"
    }

  } catch (error) {
    return {
      success: false,
      error: error.message || error || "Error in createNewPassword action."
    }

  }
}

export async function changeUserPassword(currentPassword, newPassword) {
  if (!currentPassword || !newPassword) {
    return { success: false, message: "All fields are required" };
  }

  try {
    const sessionUser = await getSessionUser();
    // 2. Fetch user from DB with password field included
    const user = await userModel.findById(sessionUser.id);
    if (!user) {
      return { success: false, message: "User not found." };
    }

    // 3. Verify current password
    const isMatch = await bcryptjs.compare(currentPassword, user.password);
    if (!isMatch) {
      return { success: false, message: "Current password is incorrect." };
    }

    // 4. Hash and save new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    console.error("Change password error:", error);
    return { success: false, message: "Internal server error." };
  }
}

export async function getResetPasswordLink(email) {
  console.log('Enter log ', email);
  try {
    await connectToDb();

    const user = await userModel.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: 'This email is not linked with any account!'
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);
    const name = user.firstName + " " + user.lastName;

    user.verificationOtp = otp;
    user.verificationOtpExpiry = expiry;

    await user.save({ new: true });

    const resetLink = `${process.env.NEXTAUTH_URL}/forgot-password/new/${otp}`

    const emailResponse = await sendEmailToUser({
      name,
      email,
      resetLink,
      emailType: 'Reset Password'
    });

    if (emailResponse.success) {
      return {
        success: true,
        message: emailResponse.message,
        data: email
      }
    }

  } catch (error) {
    return {
      success: false,
      message: "Verifying user error!"
    }
  }
}

export async function validateResetPasswordOtp(otp) {
  try {
    await connectToDb();

    const user = await userModel.findOne(
      { verificationOtp: otp }
    )
      .select('_id verificationOtpExpiry')
      .lean();

    if (!user) throw new Error('Invalid reset password Url');

    const codeNotExpired = new Date(user.verificationOtpExpiry) > new Date();
    if (!codeNotExpired) throw new Error('Reset password url expired!')

    return {
      success: true,
      message: 'Reset successfully',
      data: JSON.parse(JSON.stringify(user._id))
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || error || 'Error in validateResetPasswordOtp'
    }
  }
}

export async function updateProfileImage(fileImage, username) {
  if (!fileImage) {
    return {
      success: false,
      message: "No image file selected",
    };
  }

  try {
    await connectToDb()

    const user = await userModel.findOne({ username });
    if (!user) {
      return {
        success: false,
        message: "No user found for this profile Image",
      };
    }

    if (user.profileImageUrl) {
      await deleteFromCloudinary(user.profileImageUrl);
    }

    const response = await uploadToCloudinary(fileImage);
    if (response.success) {
      user.profileImageUrl = response.url;
      await user.save();
      revalidatePath(`${process.env.NEXTAUTH_URL}/${user.username}`);
      return {
        success: true,
        message: "Profile image updated Successfully",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Error in profile image update action",
    };
  }
}

export async function updateCoverImage(fileImage, username) {
  if (!fileImage) {
    return {
      success: false,
      message: "No image file selected",
    };
  }

  try {
    await connectToDb()

    const user = await userModel.findOne({
      username,
    });

    if (!user) {
      return {
        success: false,
        message: "No user found for this cover Image",
      };
    }

    const oldCoverImageUrl = user.coverImageUrl;

    const response = await uploadToCloudinary(fileImage);
    if (response.success) {
      user.coverImageUrl = response.url;
      await user.save();
      if (oldCoverImageUrl !== '') {
        await deleteFromCloudinary(oldCoverImageUrl);
      }

      revalidatePath(`${process.env.NEXTAUTH_URL}/${user.username}`);
      return {
        success: true,
        message: "Cover image updated Successfully",
      };
    }
  } catch (error) {
    console.log(`Error in update cover image action : ${error}`);

    return {
      success: false,
      message: `Error in update cover image action : ${error.message}`,
    };
  }
}

export async function deleteCoverImage(coverUrl, userId) {

  try {
    await connectToDb();

    const user = await userModel.findById(userId);

    if (!user) throw new Error("No user found for this cover Image");

    user.coverImageUrl = '';

    const res = await Promise.all[
      deleteFromCloudinary(coverUrl),
      user.save()
    ]

    console.log("res : ", res)

    return {
      success: true,
      message: "Cover image deleted Successfully!"
    }

  } catch (error) {
    return {
      success: false,
      message: `Error in cover image delete action : ${error.message || error}`
    }
  }
}

export async function updateProfile(userId, data) {
  try {
    await connectToDb()

    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("No user found")
    }

    await userModel.findByIdAndUpdate(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
      location: data.location,
      occupation: data.occupation,
      relationshipStatus: data.relationshipStatus
    })

    return {
      success: true,
      message: "Updated Successfully",
    };
  } catch (error) {
    console.log("Updating Profile action with error : ", error.message || error);

    return {
      success: false,
      message: `Something went wrong with error : ${error.message || error} !`,
    };
  }
}

export async function getLoggedInUser() {
  await connection();

  try {
    const sessionUser = await getSessionUser();

    const loggedInUser = await userModel
      .findById(sessionUser.id)
      .select("username firstName lastName email profileImageUrl")
      .lean();

    if (!loggedInUser) throw new Error("No user found for this Id!")

    return {
      success: true,
      message: "LoggedIn user found!",
      data: JSON.parse(JSON.stringify(loggedInUser)),
    };
  } catch (error) {
    console.error(`Error in getLoggedInUser action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in getLoggedInUser action : ${error.message || error}`,
    };
  }
}

export async function getLoggedInUserProfile(username) {
  try {
    const [sessionUser, loggedInUser] = await Promise.all([
      getSessionUser(),
      userModel
        .findOne({ username })
        .select("username firstName lastName profileImageUrl coverImageUrl bio location occupation relationshipStatus createdAt")
        .lean()
    ])

    if (!loggedInUser) throw new Error(`No user found for this username : ${username}!`)

    const isOwnProfile = sessionUser.id === String(loggedInUser._id) ? true : false;

    return {
      success: true,
      message: "LoggedInUser profile found!",
      data: JSON.parse(JSON.stringify({ loggedInUser: loggedInUser, isOwnProfile: isOwnProfile })),
    };
  } catch (error) {
    console.error(`Error in getLoggedInUserProfile action : ${error.message || error}`);
    return {
      success: false,
      message: `Error in getLoggedInUserProfile action : ${error.message || error}`,
    };
  }
}

export async function getUserBySearchedName(searchName) {
  if (!searchName) {
    return {
      success: false,
      message: "Input value is required to be searched",
    };
  }

  try {
    await getSessionUser();

    const cleanSearchName = searchName.trim();

    const users = await userModel
      .find({
        $or: [
          { firstName: { $regex: cleanSearchName, $options: "i" } },
          { lastName: { $regex: cleanSearchName, $options: "i" } },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$firstName", " ", "$lastName"] },
                regex: cleanSearchName,
                options: "i",
              },
            },
          },
        ],
      })
      .select("username firstName lastName profileImageUrl location occupation")
      .lean();

    return {
      success: true,
      message: "Data Found",
      data: JSON.parse(JSON.stringify(users)),
    };
  } catch (error) {
    return {
      success: false,
      message: `Error in getUserBySearchedName : ${error.message || error}`,
    };
  }
}