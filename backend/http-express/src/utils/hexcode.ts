import * as CryptoJS from "crypto-js";

export const generateColor = (username: string): string => {
  const hash = CryptoJS.SHA256(username).toString(CryptoJS.enc.Hex);

  const r = parseInt(hash.substring(0, 2), 16);
  const g = parseInt(hash.substring(2, 4), 16);
  const b = parseInt(hash.substring(4, 6), 16);

  const alpha = Math.random() * (1 - 0.35) + 0.35;

  const alphaHex = Math.floor(alpha * 255)
    .toString(16)
    .padStart(2, "0");

  const hexColor = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}${alphaHex}`;

  return hexColor;
};
