import { supabase } from "./index.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// function to upload image to supabase
export const uploadImageToSupabase = async (imageFile) => {
  try {
    if (!imageFile) throw new Error("No image file provided.");
    // generate unique filename
    const ext = path.extname(imageFile.originalname);
    const filename = `${uuidv4()}${ext}`;
    const buffer = imageFile.buffer;
    // uploding file to supabase bucket
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .upload(`${process.env.SUPABASE_BUCKET_PATH}/${filename}`, buffer, {
        contentType: "image/png" || "image/jpg" || "image/jpeg",
      });
    // error checking
    if (error) throw new Error(`Failed to upload image : ${error.message}`);
    // generate URL from uploaded file
    const imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET_NAME}/${process.env.SUPABASE_BUCKET_PATH}/${filename}`;
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image to Supabase :", error);
    throw error;
  }
};

// function to delete image from supabase based on image url
export const deleteImageFromSupabase = async (imageUrl) => {
  const fileName = imageUrl.split("/").pop(); // Ambil nama file lama
  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME)
    .remove([`${process.env.SUPABASE_BUCKET_PATH}/${fileName}`]);
  if (error) throw new Error(`Failed to deleted image : ${error.message}`);
};
