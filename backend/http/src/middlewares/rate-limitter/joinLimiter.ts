import { Context, Next } from "hono";

interface JoinRequestI {
  [key: string]: {
    count: number;
    lastReqTime: number;
  };
}
const joinRequests: JoinRequestI = {};

export const joinLimiter = async (c: Context, next: Next) => {
  const userId = c.req.userId;
  console.log(userId);
  const gap = 5 * 60 * 1000;
  const currentTime = Date.now();

  if (!joinRequests[userId]) {
    joinRequests[userId] = {
      count: 1,
      lastReqTime: Date.now(),
    };
    await next();
    return;
  }

  let { lastReqTime, count } = joinRequests[userId];
  if (currentTime - lastReqTime > gap) {
    joinRequests[userId] = {
      count: 1,
      lastReqTime: currentTime,
    };
    await next();
    return;
  }
  if (count > 30) {
    c.status(429);
    return c.json({
      status: "error",
      message:
        "Too many tab joining attempts. Please wait 5 minutes before trying again.",
    });
  }

  joinRequests[userId].count = count + 1;
  joinRequests[userId].lastReqTime = currentTime;
  await next();
};
