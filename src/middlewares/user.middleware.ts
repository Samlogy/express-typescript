import { Request, Response, NextFunction } from "express";
import { get } from "lodash";

// check user role
export const userRole = (role: string) => {
	return (req: any, res: Response, next: NextFunction) => {
	  if (req.user.role !== role) {
		return res.status(401).send('Not allowed')
	  }
	  next();
	}
};

// auth required
export const requiresUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = get(req, "user");
  
    if (!user) return res.sendStatus(403);
  
    return next();
};