export {};

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}
declare module "hono" {
  interface HonoRequest {
    userId: string;
  }
}
