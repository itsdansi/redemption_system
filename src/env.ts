import dotenv from "dotenv";

/**
 * Initialize environment variables.
 */
dotenv.config();

// The env variables that are used by the api
export default {
  mailTransporter: process.env.MAIL_TRANSPORTER
    ? process.env.MAIL_TRANSPORTER
    : "ethereal",
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  emailHost: process.env.HOST,
  emailPort: process.env.PORT,

  // smsAuthProtal: process.env.SMS_AUTH_PORTAL,
  // smsMethod: process.env.SMS_METHOD,
  // smsAuthUser: process.env.SMS_AUTH_USER,
  // smsAuthPassword: process.env.SMS_AUTH_PASSWORD,
  // smsAuthSender: process.env.SMS_AUTH_SENDER_ID,
  // smsDltAuthSenderId: process.env.SMS_AUTH_DLT_SENDER_ID,
  // smsAuthRoute: process.env.SMS_AUTH_ROUTE,

  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
};
