import { Context, Next } from "hono";

interface LoginRequestI {
  [key: string]: {
    count: number;
    lastReqTime: number;
  };
}
const loginRequests: LoginRequestI = {};

export const loginLimiter = async (c: Context, next: Next) => {
  const username = (await c.req.json()).username;

  const gap = 5 * 60 * 1000;
  const currentTime = Date.now();

  if (!loginRequests[username]) {
    loginRequests[username] = {
      count: 1,
      lastReqTime: Date.now(),
    };
    await next();
    return;
  }

  let { lastReqTime, count } = loginRequests[username];

  if (currentTime - lastReqTime > gap) {
    loginRequests[username] = {
      count: 1,
      lastReqTime: currentTime,
    };
    await next();
    return;
  }
  if (count > 10) {
    c.status(429);
    return c.json({
      status: "error",
      message:
        "Too many login attempts. Please wait 5 minutes before trying again.",
    });
  }

  loginRequests[username].count = count + 1;
  loginRequests[username].lastReqTime = currentTime;
  await next();
};
