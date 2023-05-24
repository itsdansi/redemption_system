import axios from "axios";
import env from "../env";
import {log} from "console";

export async function sendOTPSMS(phoneNumber: number, payload: any) {
  const smsData = {
    Account: {
      User: env.smsAuthUser,
      Password: env.smsAuthPassword,
      Senderid: env.smsAuthSender,
      Channel: 2,
      DCS: 0,
      Flashsms: 0,
      Route: env.smsAuthRoute,
      DLTSenderid: env.smsDltAuthSenderId,
      SchedTime: null as any,
      GroupId: null as number | null,
    },
    Messages: [
      {
        Number: phoneNumber,
        Text: payload,
      },
    ],
  };
  const smsAPIResponse = await invokeThirdPartyApi(
    "POST",
    env.smsAuthProtal,
    smsData,
    null
  );
  return smsAPIResponse;
}

async function invokeThirdPartyApi(method: any, url: any, data: any, headers: any) {
  try {
    console.log({method, url, data, headers});
    let apiResponseTemp;
    await axios({method, url, data, headers})
      .then((apiResponse) => {
        apiResponseTemp = apiResponse.data;
      })
      .catch((error) => console.info(error));
    return apiResponseTemp;
  } catch (error) {
    console.warn(error);
    return error;
  }
}

// Generate a random 6-digit OTP
export const generateOTP = () => {
  const digits = "123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};
