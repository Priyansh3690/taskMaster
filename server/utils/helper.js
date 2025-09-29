export function generateOTP(length = 6) {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
}

export function generateSessionData(length = 4) {
  let SessionData = "";
  const alphabet = [
    "A", "B", "c", "D", "E", "f", "G", "H", "i", "J",
    "K", "L", "m", "N", "O", "p", "Q", "R", "s", "T",
    "U", "V", "w", "X", "Y", "z"
  ]
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < length; i++) {
      SessionData += Math.floor(Math.random() * 10);
    }
    const randomNum = Math.floor(Math.random() * 26) + 1;
    SessionData += alphabet[randomNum];
  }
  return SessionData;
}