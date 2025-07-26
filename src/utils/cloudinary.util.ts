import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SEC
});

const uploadOnCloud = async (filePath: string) => {
  try{
    if(!filePath) return null;
    // upload the file on cloud
    cloudinary.uploader.upload(filePath, { resource_type: "auto" })
    // file has been uploaded
  }
  catch(e) {

  }
}