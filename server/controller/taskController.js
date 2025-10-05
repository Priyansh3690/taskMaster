import path from "path";
import { fileURLToPath } from "url";
import {
  checkUserExists,
  registerUserq,
  SetOTP,
  validateOTP,
  invalidOTP,
  setSessionData,
  logOut,
  getUsernameq
} from "../models/taskModel.js";

import {
  generateOTP,
  generateSessionData
} from "../utils/helper.js";

import { sendTelegramMessage } from "../services/telegramService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const redirectTOIndex = (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'client', 'index.html'));
};

export const redirectTOsignup = async (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'client', 'signup.html'));
};

export const checkSession = (req, res) => {
  res.json({ success: true });
};

export const registerUser = async (req, res) => {
  const { username, email, chatid } = req.body;
  const check = await checkUserExists(email);
  if (check.exists) {
    return res.json({ success: false });
  }
  await registerUserq(username, email, chatid);
  return res.json({ success: true });
};


export const sendOTP = async (req, res) => {
  const { email } = req.body;
  const check = await checkUserExists(email);
  if (!check.exists) {
    return res.json({ success: false });
  }
  const otp = generateOTP();
  await SetOTP(otp, check.uid);
  const text=`The OTP is ${otp}`;
  await sendTelegramMessage(check.chatid, text);
  return res.json({ success: true });
};

export const checkOTP = async (req, res) => {
  const { email, otp } = req.body;

  const check = await checkUserExists(email);
  if (!check.exists) {
    return res.json({ success: false });
  }
  const isValid = await validateOTP(otp, check.uid);
  if (!isValid.exists) {
    return res.json({ success: false });
  }
  await invalidOTP(otp, check.uid);
  const data = generateSessionData();
  await setSessionData(data, check.uid);
  const token = { uid: check.uid, Token: data };
  return res.json({ success: true, token: token });
};

export const logout = async (req, res) => {
  const { token } = req.body;
  await logOut(token.uid);
  return res.json({ success: true });
};

export const getUserName = async (req, res) => {
  const { token } = req.body;
  const unm = await getUsernameq(token.uid);
  return res.json({ success: true, unm: unm.rows[0].username });
};