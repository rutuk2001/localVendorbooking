import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/db.js';
import { success, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/generateToken.js';
import dayjs from 'dayjs';

const REFRESH_EXPIRES_DAYS = 7;

const buildAuthTokens = async (user) => {
  const payload = { id: user.id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: dayjs().add(REFRESH_EXPIRES_DAYS, 'day').toDate(),
    },
  });

  return { accessToken, refreshToken };
};

const sanitizeUser = (user) => {
  // eslint-disable-next-line no-unused-vars
  const { password, emailVerifyToken, resetPasswordToken, resetPasswordExpires, ...safe } = user;
  return safe;
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role, businessName } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const emailVerifyToken = crypto.randomBytes(32).toString('hex');

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || 'CUSTOMER',
      emailVerifyToken,
    },
  });

  if (user.role === 'VENDOR') {
    await prisma.vendor.create({
      data: {
        userId: user.id,
        businessName: businessName || `${name}'s Business`,
      },
    });
  }

  const tokens = await buildAuthTokens(user);

  // In production this would be emailed via a mail service (SendGrid/SES/etc).
  // Returned here so the flow is testable without a mail provider configured.
  return success(res, 201, 'Registration successful', {
    user: sanitizeUser(user),
    ...tokens,
    emailVerifyToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, 'Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  if (!user.isActive) throw new ApiError(403, 'This account has been deactivated');

  const tokens = await buildAuthTokens(user);

  return success(res, 200, 'Login successful', {
    user: sanitizeUser(user),
    ...tokens,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(400, 'Refresh token is required');

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || dayjs(stored.expiresAt).isBefore(dayjs())) {
    throw new ApiError(401, 'Refresh token expired or not recognized, please log in again');
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) throw new ApiError(401, 'User not found');

  // rotate refresh token
  await prisma.refreshToken.delete({ where: { id: stored.id } });
  const tokens = await buildAuthTokens(user);

  return success(res, 200, 'Token refreshed', tokens);
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  return success(res, 200, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { vendorProfile: true },
  });
  return success(res, 200, 'Current user fetched', sanitizeUser(user));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
  if (!user) throw new ApiError(400, 'Invalid or expired verification token');

  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, emailVerifyToken: null },
  });

  return success(res, 200, 'Email verified successfully');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always respond the same way to avoid leaking which emails are registered.
  if (!user) {
    return success(res, 200, 'If that email exists, a reset link has been sent');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: resetToken,
      resetPasswordExpires: dayjs().add(1, 'hour').toDate(),
    },
  });

  // Would be emailed in production; returned here for dev/testing purposes.
  return success(res, 200, 'If that email exists, a reset link has been sent', { resetToken });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await prisma.user.findFirst({
    where: { resetPasswordToken: token, resetPasswordExpires: { gt: new Date() } },
  });
  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
  });

  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

  return success(res, 200, 'Password reset successful, please log in again');
});
