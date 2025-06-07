import { NextFunction, Request, Response } from "express";

interface JoinRequestI {
  [key: string]: {
    count: number;
    lastReqTime: number;
  };
}
const joinRequests: JoinRequestI = {};

export const joinLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  console.log(userId);
  const gap = 5 * 60 * 1000;
  const currentTime = Date.now();

  if (!joinRequests[userId]) {
    joinRequests[userId] = {
      count: 1,
      lastReqTime: Date.now(),
    };
    next();
    return;
  }

  let { lastReqTime, count } = joinRequests[userId];
  if (currentTime - lastReqTime > gap) {
    joinRequests[userId] = {
      count: 1,
      lastReqTime: currentTime,
    };
    next();
    return;
  }
  if (count > 30) {
    res.status(429).json({
      status: "error",
      message:
        "Too many tab joining attempts. Please wait 5 minutes before trying again.",
    });
    return;
  }

  joinRequests[userId].count = count + 1;
  joinRequests[userId].lastReqTime = currentTime;
  next();
};
