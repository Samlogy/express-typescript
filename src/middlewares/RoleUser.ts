import { Request, Response, NextFunction } from "express";

// check user role
const userRole = (role: string) => {
	return (req: any, res: Response, next: NextFunction) => {
	  if (req.user.role !== role) {
		return res.status(401).send('Not allowed')
	  }
	  next();
	}
};

export default userRole;