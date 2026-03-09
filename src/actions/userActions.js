"use server";

import uploadToCloudinary from "@/helpers/uploadToCloudinary";
import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import { revalidatePath } from "next/cache";
import { startsWith, success } from "zod";

// TODO:Checks for authentication before setting any user data

export async function updateProfileImage(fileImage, username) {
  if (!fileImage) {
    return {
      success: false,
      message: "No image file selected",
    };
  }

  const user = await userModel.findOne({ username });

  if (user) {
    const response = await uploadToCloudinary(fileImage);
    if (response.success) {
      user.profileImageUrl = response.url;
      await user.save();
      revalidatePath(`${process.env.NEXTAUTH_URL}/${user.username}`);
      return {
        success: true,
        message: "Profile image updated Successfully",
        newProfileImageUrl: user.profileImageUrl,
      };
    }

    return {
      success: false,
      message: response.message,
    };
  }

  return {
    success: false,
    message: "No user found for this profile Image",
  };
}

export async function updateCoverImage(fileImage, username) {
  if (!fileImage) {
    return {
      success: false,
      message: "No image file selected",
    };
  }

  const user = await userModel.findOne({
    username,
  });

  if (user) {
    const response = await uploadToCloudinary(fileImage);
    if (response.success) {
      user.coverImageUrl = response.url;
      await user.save();

      revalidatePath(`${process.env.NEXTAUTH_URL}/${user.username}`);
      return {
        success: true,
        message: "Cover image updated Successfully",
      };
    }

    return {
      success: false,
      message: response.message,
    };
  }

  return {
    success: false,
    message: "No user found for this cover Image",
  };
}

export async function updateProfile(userId, data) {
  try {
    const user = await userModel.findById(userId);

    if (!user)
      return {
        success: false,
        message: "No user found",
      };

    ((user.firstName = data.firstName),
      (user.lastName = data.lastName),
      (user.bio = data.bio),
      (user.location = data.location),
      (user.occupation = data.occupation),
      (user.relationshipStatus = data.relationshipStatus));

    await user.save();

    return {
      success: true,
      message: "Updated Successfully",
    };
  } catch (error) {
    console.log("Updating Profile action with error : ", error);

    return {
      success: false,
      message: "Something went wrong!",
    };
  }
}

export async function getLoggedInUser(sessionId) {
  if (!sessionId) {
    return {
      success: false,
      message: "No id to get for loggedIn user!",
    };
  }

  try {
    await connectToDb();

    const loggedInUser = await userModel
      .findById(sessionId)
      .select("firstName lastName email profileImageUrl")
      .lean();

    if (!loggedInUser) {
      return {
        success: false,
        message: "No user found for this Id!",
      };
    }

    return {
      success: true,
      message: "LoggedIn user found!",
      data: JSON.parse(JSON.stringify(loggedInUser)),
    };
  } catch (error) {
    console.log("Error in getting loggedIn user action : ", error);
    return {
      success: false,
      message: `Error in getting loggedIn user action : ${error.message}`,
    };
  }
}

export async function getUserByFirstName(searchName) {
  console.log("Name is :", searchName);
  if (!searchName) {
    return {
      success: false,
      message: "Input value is required to be searched",
    };
  }

  const regex = new RegExp(`^${searchName}`, "i");

  const users = await userModel
    .find({ firstName: regex })
    .select(
      "username firstName lastName profileImageUrl location occupation",
    )
    .lean();

  return {
    success: true,
    message: "Data Found",
    data: JSON.parse(JSON.stringify(users)),
  };
}
