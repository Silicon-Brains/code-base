import type { Response, NextFunction } from "express";
import type { AuthedRequest } from "./requireAuth.js";

export function requireRole(...roles: Array<"admin" | "client">) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.profile) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.profile.role)) {
      return res.status(403).json({ error: "Forbidden — insufficient role" });
    }
    next();
  };
}
