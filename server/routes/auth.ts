import type { Request, Response } from 'express'
import express from 'express'
import connection from '../db/db.ts'
import type { User } from 'shared/types/database'
import { compare } from '../lib/utils.ts'
import jwt from 'jsonwebtoken'
import type { AuthPayload } from 'shared/types/api.ts'

const authRoutes = express.Router()

interface LoginRequestBody {
  username: string
  password: string
}

authRoutes.post(
  '/login',
  async (req: Request<unknown, unknown, LoginRequestBody>, res: Response) => {
    const { username, password } = req.body

    try {
      const [users] = await connection.execute<User[]>(
        `
      SELECT *
      FROM users
      WHERE username = ?
      `,
        [username]
      )

      const user = users[0]

      if (!user) {
        return res
          .status(400)
          .json({ error: { message: 'Invalid credentials' } })
      }

      const isMatched = await compare(password, user.password)

      if (!user.username || isMatched === false) {
        return res
          .status(400)
          .json({ error: { message: 'Invalid credentials' } })
      }

      const authPayload: AuthPayload = {
        user: {
          id: user.id,
          username: user.username,
        },
      }

      const accessToken = jwt.sign(authPayload, 'jwt-access', {
        expiresIn: '5m',
      })
      const refreshToken = jwt.sign(authPayload, 'jwt-refresh', {
        expiresIn: '7d',
      })

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      return res.status(200).json(accessToken)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Database error' })
    }
  }
)

authRoutes.post('/refresh', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken)
    return res.status(401).json({ error: { message: 'No refresh token' } })

  try {
    const tokenPayload = jwt.verify(refreshToken, 'jwt-refresh')

    const accessToken = jwt.sign(tokenPayload, 'jwt-access')

    return res.json({ accessToken })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Database error' })
  }
})

authRoutes.delete('/logout', async (req: Request, res: Response) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: false,
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Database error' })
  }
})

export default authRoutes
