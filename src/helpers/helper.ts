import { hashSync, compareSync } from "bcrypt";
import CryptoJS from "crypto-js";
import { decode } from "jsonwebtoken";
import User from "../models/user";
import Location from "../models/location";
import Address from "../models/address";
import Request from "../models/request";
import constants from "../utils/constants";
import { unlinkSync } from "fs";
import crypto from "crypto";
// import Request from "../models/request";
import mongoose from "mongoose";
const ipInfo = require("ip-info-finder");

const getMessage = async (msg: any) => {
  const errMsg: any = Object.values(msg.errors)[0];
  return errMsg[0];
};

const unixTime = async (date: any) => {
  return new Date(date).getTime();
};

const validateRequestData = async (validationRule: any, data: any) => {
  const entries1 = Object.entries(validationRule);
  const entries2 = Object.entries(data);

  if (entries1.length < entries2.length) {
    return false;
  }

  for (const [key, value] of entries2) {
    if (!validationRule.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

const randomNumber = async () => {
  const num = Math.floor(1000 + Math.random() * 9000);
  return num;
};

const createSlug = async (title: string) => {
  let slug = title.toLowerCase();
  slug = slug.replace(/[^a-z0-9\-_\s]/g, ""); // Remove non-alphanumeric characters
  slug = slug.replace(/\s+/g, "-"); // Replace spaces with hyphens
  slug = slug.replace(/[-_]+/g, "-"); // Remove  hyphens and underscores
  slug = slug.replace(/^-+|-+$/g, ""); //  Remove leading and trailing hyphens and underscores
  return slug;
};

const toLowerCase = async (text: string) => {
  return text.toLowerCase();
};

const minutes = async (time: any) => {
  const prevTime = new Date(time).getTime();
  const curnTime = new Date().getTime();
  const minutes = Math.round((curnTime - prevTime) / 1000 / 60);
  return minutes;
};

const getUsername = async (email: string) => {
  const username = `${email.split("@")[0]}${Math.floor(
    10 + Math.random() * 90
  )}`;

  return await User.findOne({
    username: username,
  })
    .then(async (data) => {
      if (data) {
        getUsername(email);
      } else {
        return username;
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};

const hashPassword = async (password: string) => {
  const saltRounds = 15;
  return hashSync(password, saltRounds);
};

const checkPassword = async (password: string, hash: string) => {
  return compareSync(password, hash);
};

const getPinDetail = async (pinCode: string) => {
  return await Location.aggregate([
    { $match: { pinCode: pinCode } },
    {
      $lookup: {
        from: "cities",
        foreignField: "_id",
        localField: "cityId",
        as: "cityDetail",
      },
    },
    { $unwind: "$cityDetail" },
    {
      $lookup: {
        from: "states",
        foreignField: "_id",
        localField: "cityDetail.stateId",
        as: "stateDetail",
      },
    },
    { $unwind: "$stateDetail" },
    {
      $lookup: {
        from: "countries",
        foreignField: "_id",
        localField: "stateDetail.countryId",
        as: "countryDetail",
      },
    },
    { $unwind: "$countryDetail" },
    {
      $project: {
        _id: 1,
        name: 1,
        pinCode: 1,
        cityId: "$cityDetail._id",
        cityName: "$cityDetail.name",
        stateId: "$stateDetail._id",
        stateName: "$stateDetail.name",
        countryId: "$countryDetail._id",
        countryName: "$countryDetail.name",
      },
    },
  ])
    .then((data: any) => {
      if (data) {
        return data[0];
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const generateAddressSlug = async (
  name: string,
  address_type: string,
  pin_code: string
) => {
  const slug: string = `${
    name.split(" ")[0]
  }-${address_type}-${pin_code}-${Math.floor(1000 + Math.random() * 9000)}`;

  return await Address.findOne({
    slug: slug.toLowerCase(),
  })
    .then(async (data) => {
      if (data) {
        generateAddressSlug(name, address_type, pin_code);
      } else {
        return slug.toLowerCase();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};



const randomKey = async () => {
  const str = Array.from({ length: 64 }, () =>
    "0123456789abcdef".charAt(Math.floor(Math.random() * 16))
  ).join("");
  const key = CryptoJS.enc.Hex.parse(str);
  return key;
};

const randomiv = async () => {
  const str = Array.from({ length: 32 }, () =>
    "0123456789abcdef".charAt(Math.floor(Math.random() * 16))
  ).join("");
  const iv = CryptoJS.enc.Hex.parse(str);
  return iv;
};

const randomToken = async () => {
  const str = Array.from({ length: 48 }, () =>
    "0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ".charAt(
      Math.floor(Math.random() * 62)
    )
  ).join("");

  return str;
};

const jwtDecode = async (token: string) => {
  return decode(token);
};

const getFileName = async (fileUrl: string) => {
  let index = fileUrl.lastIndexOf("/") + 1;
  let filename = fileUrl.substring(index);
  return filename;
};

const fileUrl = async (host: any, filename: string) => {
  if (process.env.NODE_ENV === "dev") {
    return `http://${host}/files/${filename}`;
  } else {
    return `https://${host}/files/${filename}`;
  }
};

const photoUrl = async (host: string, filename: string) => {
  if (process.env.NODE_ENV === "dev") {
    return `http://${host}/photos/${filename}`;
  } else {
    return `https://${host}/photos/${filename}`;
  }
};

const imageUrl = async (host: string, filename: string) => {
  return `http://${host}/images/${filename}`;
};

const removeFile = async (filename: string) => {
  return unlinkSync(`public/files/${filename}`);
};

const removePhoto = async (filename: string) => {
  return unlinkSync(`public/photos/${filename}`);
};

const removeImage = async (filename: any) => {
  return unlinkSync(`public/images/${filename}`);
};

const createPassword = async (name: any, dob: any) => {
  const newName = name.charAt(0).toUpperCase() + name.slice(1);
  const date = new Date(dob);
  const year = date.getFullYear();
  return `${newName}@${year}`;
};

const isDateValid = async (date: any) => {
  const newDate: any = new Date(date);
  return !isNaN(newDate);
};

const encryptMsg = async (msg: string, key: any) => {
  const encrypted = CryptoJS.AES.encrypt(msg, key);
  return encrypted.toString();
};

const decryptMsg = async (msg: string, key: any) => {
  const decrypted = CryptoJS.AES.decrypt(msg, key);
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const encryptObj = async (msg: any, key: any) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(msg), key);
    return encrypted.toString();
  } catch (err) {
    return false;
  }
};

const decryptObj = async (msg: any, key: any) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(msg, key);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    return false;
  }
};

const timeString = async () => {
  return Date.now().toString();
};

const createBufferObject = async (msg: any) => {
  return Buffer.from(msg).toString("base64");
};

const hashMessage = async (msg: string, key: string) => {
  return crypto.createHmac("SHA256", msg).update(key).digest();
};

const objectToQS = async (data: any) => {
  return new URLSearchParams(data).toString();
};



const getIPInfo = async (ip: string) => {
  if (await ipInfo.getIPInfo.isIPv4(ip)) {
    return await ipInfo
      .getIPInfo(ip)
      .then((data: any) => {
        return data;
      })
      .catch((err: any) => {
        // throw err;
        return {
          lat: null,
          lon: null,
        };
      });
  } else {
    return {
      lat: null,
      lon: null,
    };
  }
};


const createRequest = async (data: any) => {
  return Request.findOneAndUpdate(
    {
      userId: new mongoose.Types.ObjectId(data.userId),
      tableId: new mongoose.Types.ObjectId(data._id),
      status: constants.requestStatus.pending,
    },
    {
      userId: new mongoose.Types.ObjectId(data.userId),
      tableId: new mongoose.Types.ObjectId(data._id),
      status: constants.requestStatus.pending,
    },
    { new: true, upsert: true }
  ).then((request_detail) => {
    if (request_detail) {
      return true;
    }
  });
};

// const generateTableBookingNumber=async()=> {
//   const date = new Date(); 
//   const unixTimestamp = Math.floor(date.getTime() / 1000);
//   return `SK${unixTimestamp}`;
// }


const generateTableBookingNumber=async()=> {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `#SK${num}`;
}




const  convertToIST=async(isoDate:string)=> {
  // Convert ISO date string to Date object
  const date = new Date(isoDate);
  
  // Add 5 hours and 30 minutes for IST (Indian Standard Time) offset
  // date.setHours(date.getHours() + 5);
  // date.setMinutes(date.getMinutes() + 30);

  // Format the date in IST
  const options:any = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata' // Set time zone to IST
  };
  const istDate = date.toLocaleString('en-US', options);

  return istDate;
}


export {
  getMessage,
  unixTime,
  validateRequestData,
  randomNumber,
  createSlug,
  toLowerCase,
  minutes,
  getUsername,
  hashPassword,
  checkPassword,
  getPinDetail,
  generateAddressSlug,
  randomKey,
  randomiv,
  randomToken,
  jwtDecode,
  getFileName,
  fileUrl,
  photoUrl,
  imageUrl,
  removeFile,
  removePhoto,
  removeImage,
  createPassword,
  isDateValid,
  encryptMsg,
  decryptMsg,
  encryptObj,
  decryptObj,
  timeString,
  createBufferObject,
  hashMessage,
  objectToQS,
  getIPInfo,
  createRequest,
  generateTableBookingNumber,
  convertToIST
};
