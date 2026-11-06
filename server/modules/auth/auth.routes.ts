import express from 'express';
const router = express.Router()
import {  register, login, refresh, logout  } from './auth.controller';
import {  protect  } from '../../middleware/auth';
import passport from '../../config/passport';
import jwt from 'jsonwebtoken';
import User from '../../models/pg/user';

// Existing routes
router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)

// Protected test route
router.get('/me', protect, async (req: any, res: any) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user })
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error fetching user' })
  }
})

// Google OAuth routes
// Use only the first CLIENT_URL entry for redirects — the env var may be
// comma-separated (multiple CORS origins) but a redirect must be a single URL.
const primaryClientUrl = (): string =>
  (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${primaryClientUrl()}/login?error=oauth_failed` }),
  (req: any, res: any) => {
    // Generate JWT after Google login
    const accessToken = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { id: req.user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    )

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    // Redirect to frontend with token
    res.redirect(`${primaryClientUrl()}/auth/callback?token=${accessToken}`)
  }
)

export default router;