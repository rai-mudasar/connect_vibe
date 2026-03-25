import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "facebook_clone",
            resource_type: "auto",
          },

          (error, res) => {
            if (error) reject(error);
            else resolve(res);
          },
        )
        .end(buffer);
    });

    // console.log("Res : ", response)

    if (response.secure_url) {
      return {
        success: true,
        message: "Upload Successfully",
        url: response.secure_url,
      };
    }
  } catch (error) {
    console.log(
      `Something went wrong in Cloudinary Upload with error : ${error}`,
    );
    throw new Error(
      error.message || "Something went wrong in Cloudinary Upload!",
    );
  }
}

export async function deleteFromCloudinary(fileLink) {
  const linkArray = fileLink.split("/");
  const fileName = linkArray[8].slice(0, -4);

  try {
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(`facebook_clone/${fileName}`, (error, res) => {
        if (error) reject(error);
        else resolve(res);
      });
    });

    if (response.result !== "ok")
      throw new Error("Something went wrong with cloudinary Delete!");
  } catch (error) {
    console.log(
      `Cloudinary Delete image with error : ${error.message || error}`,
    );

    throw new Error(
      error.message || error || "Something went wrong with cloudinary Delete!",
    );
  }
}
