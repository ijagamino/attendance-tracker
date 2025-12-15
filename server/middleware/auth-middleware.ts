import jwt from 'jsonwebtoken'
import type { AuthPayload } from 'shared/types/api.ts'
import type { Request, Response, NextFunction } from 'express'

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  const payload = jwt.verify(token, 'jwt-access') as AuthPayload

  res.locals = payload

  next()
}
