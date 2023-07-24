const express = require("express");
const asyncHandler = require("express-async-handler");
const fetch = require("node-fetch");

const s3Router = express.Router();

const { protect } = require("./User");

const {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

// Set the AWS Region.
const REGION = "ap-south-1";

// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: REGION,
  signer: {
    sign: async (request) => request,
  },
});

// Set the Bucket parameters
const bucketParams = {
  Bucket: "testbucketfp",
  EncodingType: "url",
};

//Importing all images
const run = async () => {
  try {
    const data = await s3Client.send(new ListObjectsCommand(bucketParams));

    //Export the images from data
    images = data?.Contents.map((imgData) => {
      return {
        url:
          "https://testbucketfp.s3.ap-south-1.amazonaws.com/" +
          imgData.Key +
          "?x-id=GetObject", //https://testbucketfp.s3.ap-south-1.amazonaws.com/Screenshot+2022-02-10+at+5.03.58+PM.jpg?x-id=GetObject
        size: imgData.Size,
      };
    });

    return images;
  } catch (err) {
    console.log("Error", err);
  }
};

s3Router.get(
  "/s3",
  protect,
  asyncHandler(async (req, res) => {
    const images = await run();

    res.send(images);
  })
);

s3Router.get("/drive", protect, (req, res) => {
  //Credentials
  const API_KEY = "AIzaSyAjNCCsbz_5utmTKWGv9zE_J8smOrltX1Q";
  const folderId = "1_qOJ0z3kI_e2IJq4X6HqF0T1ROBESygS";

  fetch(
    `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}`
  )
    .then((_res) => _res.json())
    .then((data) => {
      let imgUrls = data.files.map((file) => {
        if (file.mimeType.startsWith("image/")) {
          // Construct image URL from the file ID
          return {
            url: `https://drive.google.com/uc?export=view&id=${file.id}`,
            name: file.name,
          };
        }
      });
      res.send(imgUrls);
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
      res.send(error);
    });
});

module.exports = s3Router;

// const command = new GetObjectCommand({
//   Bucket: "testbucketfp",
//   Key: "daviduser.jpg",
// });
// console.log(command);
// const response = await s3Client.send(command);
