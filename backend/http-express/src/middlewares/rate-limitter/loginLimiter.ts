import { NextFunction, Request, Response } from "express";

interface LoginRequestI {
  [key: string]: {
    count: number;
    lastReqTime: number;
  };
}
const loginRequests: LoginRequestI = {};

export const loginLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;

  if (!username.trim()) {
    res.status(404).json({ message: "Username required" });
    return;
  }
  const gap = 5 * 60 * 1000;
  const currentTime = Date.now();

  if (!loginRequests[username]) {
    loginRequests[username] = {
      count: 1,
      lastReqTime: Date.now(),
    };
    next();
    return;
  }

  let { lastReqTime, count } = loginRequests[username];

  if (currentTime - lastReqTime > gap) {
    loginRequests[username] = {
      count: 1,
      lastReqTime: currentTime,
    };
    next();
    return;
  }
  if (count > 10) {
    res.status(429).json({
      status: "error",
      message:
        "Too many login attempts. Please wait 5 minutes before trying again.",
    });
    return;
  }

  loginRequests[username].count = count + 1;
  loginRequests[username].lastReqTime = currentTime;
  next();
};
