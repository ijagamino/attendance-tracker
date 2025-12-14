import express from 'express'
import authRoutes from './auth.ts'
import attendanceRecordRoutes from './attendance-records.ts'
import userRoutes from './users.ts'
import dashboardRoutes from './dashboard.ts'
import authMiddleware from '../middleware/auth-middleware.ts'

const router = express.Router()

router.use('/auth', authRoutes)

router.use(authMiddleware)
router.use('/attendance-records', attendanceRecordRoutes)
router.use('/users', userRoutes)
router.use('/dashboard', dashboardRoutes)

export default router
