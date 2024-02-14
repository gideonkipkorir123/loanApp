import { NextFunction, Request, Response } from "express"

export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
    
    if (!req.user) {
        return res.status(403).json({
            message: "Invalid session"
        })
    }

    return next()
}

export const ROLES = {
    admin: 'admin',
    user: 'user',
    director: 'director',
    CEO: 'CEO'
}

export const authRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user?.role !== role) {
            return res.status(405).json({
                message: "Permission Denied!"
            })
        }
        return next()
    }
}