// import {v2 as cloudinary} from 'cloudinary'
// import fs from 'fs'

// cloudinary.config({ 
//     cloud_name: process.env.CLOUDNIRAY_CLOUD_NAME, 
//     api_key: process.env.CLOUDNIRAY_API_KEY,
//     api_secret: process.env.CLOUDNIRAY_API_SECRET  
// });

// const uploadOnCloudinary = async (localFilePath)=>{
//     console.log(localFilePath)
//     try {
//         // localFIlePath is the path of local server where the file is stored after taken from the user
//         if(!localFilePath) return null;
//     const response = await cloudinary.uploader.upload(localFilePath,{
//             resource_type: "auto",
//         })
//         // unlink for not stored on local server 
//         fs.unlinkSync(localFilePath)
//         // returns the uplaoded files address which is public
//         // console.log("file has been uploaded successfully",response.url)
//         return response.url;
//     } catch (error) {
//         // remove the localy saved temporary file as the file upload has got failed
//         fs.unlinkSync(localFilePath)
//         return null;
//     }
// }
// export  { uploadOnCloudinary }  
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
 cloudinary.config({ 
    cloud_name: process.env.CLOUDNIRAY_CLOUD_NAME, 
    api_key: process.env.CLOUDNIRAY_API_KEY,
    api_secret: process.env.CLOUDNIRAY_API_SECRET  
});

export const uploadOnCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
