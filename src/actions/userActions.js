"use server";

import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary, uploadToCloudinary } from "@/helpers/Cloudinary";

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

      if (user.oldCoverImageUrl) {
        await deleteFromCloudinary(user.oldCoverImageUrl);
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
    await connectToDb()

    await deleteFromCloudinary(coverUrl);

    const res = await userModel.findByIdAndUpdate(userId, {
      coverImageUrl: ''
    })

    console.log('Cover image res : ', res);

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
  if (!searchName) {
    return {
      success: false,
      message: "Input value is required to be searched",
    };
  }

  await connectToDb()
  // const regex = new RegExp(`^${searchName}`, "i");

  const users = await userModel
    .find({
      $or: [
        { firstName: { $regex: searchName, $options: "i" } },
        { lastName: { $regex: searchName, $options: "i" } }
      ]
    })
    .select("username firstName lastName profileImageUrl location occupation")
    .lean();

  return {
    success: true,
    message: "Data Found",
    data: JSON.parse(JSON.stringify(users)),
  };
}
