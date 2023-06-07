import axios from "axios";
import env from "../env";

// Generate a random 6-digit OTP
export const generateOTP = () => {
  const digits = "123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * digits.length)];
  }
  return OTP;
};

// SMSCountry sms helper

export const sendSMS = (phone: number, otp: number) => {
  try {
    const url = "https://api.smscountry.com/SMSCwebservice_bulk.aspx";
    const params = {
      User: "NICHINO",
      passwd: "Nichino@123",
      mobilenumber: phone,
      message: `${otp} is the OTP for registering your number on Nichino Redemption Portal. OTP is valid for 20 mins only. Please do not share with anyone.`,
      sid: "SMSCountry",
      mtype: "N",
      DR: "Y",
    };

    axios
      .post(url, null, {params})
      .then((response) => {
        const apiResponseTemp = response.data;
        console.log({apiResponseTemp});
        return apiResponseTemp;
      })
      .catch((error) => {
        // console.error(error);
      });
  } catch (error) {
    // console.warn(error);
    return error;
  }
};
