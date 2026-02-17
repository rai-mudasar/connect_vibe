import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function uploadToCloudinary(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "posts",
            resource_type: "auto",
          },

          (error, res) => {
            if (error) reject(error);
            else resolve(res);
          },
        )
        .end(buffer);
    });

    if (response.secure_url) {
      return {
        success: true,
        message: "Upload Successfully",
        url: response.secure_url,
      };
    } 
  } catch (error) {
    console.log(
      "Something went wrong in Cloudinary Upload with error : ",
      error,
    );
    return {
      success: false,
      message: error.message || "Something went wrong in Cloudinary Upload!",
    };
  }
}
