const jwt = require('jsonwebtoken');
const UAParser = require('ua-parser-js');
const ApiError = require('../utils/ApiError');
const { User } = require('../models');
// 從環境變數獲取配置
const config = {
    secretKey: process.env.JWT_SECRET || 'psp-jwt-secret',
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '1h',
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '1h',
    issuer: process.env.JWT_ISSUER || 'health-management-api',
    sessionSecret: process.env.SESSION_SECRET || 'psp-session-secret',
    sessionOptions: {
        secret: process.env.SESSION_SECRET || 'psp-session-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24小時
        }
    },

    // 密碼重設
    passwordResetExpiryMinutes: 30,

    // 重定向 URL
    frontendUrl: process.env.FRONTEND_HOST || 'https://psp-web-1083228059547.asia-east1.run.app/',
    failureRedirectUrl: process.env.FAILURE_REDIRECT_URL || '/login',
    defaultRedirectUrl: process.env.DEFAULT_REDIRECT_URL || '/',
    frontendCompleteProfileUrl: process.env.FRONTEND_COMPLETE_PROFILE_URL || '/register',
    frontendForgotPasswordUrl: process.env.FORGET_PASSWORD_URL || '/reset-password',
    frontendPageUrl: process.env.FRONTEND_PAGE_URL || '/',
    dashboardUrl: process.env.DASHBOARD_URL || '/dashboard',
};

const blacklist = new Set();

class JwtService {
    static sign(payload, options) {
        return jwt.sign(payload, config.secretKey, options);
    }
    static parseUserAgent(userAgent) {
        const parser = new UAParser(userAgent);
        return parser.getResult();
    }
    // 生成訪問令牌
    static generateAccessToken(payload) {
        return jwt.sign(payload, config.secretKey, {
            expiresIn: config.accessTokenExpiry,
            issuer: config.issuer,
        });
    }

    // 生成刷新令牌
    static generateRefreshToken(userId) {
        return jwt.sign({ userId }, config.secretKey, {
            expiresIn: config.refreshTokenExpiry,
            issuer: config.issuer,
        });
    }

    // 驗證令牌
    static verifyToken(token) {
        return jwt.verify(token, config.secretKey, {
            issuer: config.issuer,
        });
    }

    // 使用 RefreshToken 請求新的 AccessToken
    static async refreshAccessToken(refreshToken) {
        try {
            // 驗證 RefreshToken
            const decoded = this.verifyToken(refreshToken);
            const userId = decoded.userId;

            // 確認用戶存在
            const user = await User.findByPk(userId);
            if (!user) {
                throw new ApiError(404, '用戶不存在');
            }

            // 生成新的 AccessToken
            const newAccessToken = this.generateAccessToken({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                is_active: user.is_active
            });

            return newAccessToken;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ApiError(403, 'RefreshToken 已過期');
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new ApiError(403, '無效的 RefreshToken');
            }
            throw error;
        }
    }

    // 解碼令牌（不驗證）
    static decodeToken(token) {
        return jwt.decode(token);
    }

    // 生成完整的認證令牌對
    static generateTokenPair(user) {
        const tokenPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            is_active: user.is_active
        };

        return {
            accessToken: this.generateAccessToken(tokenPayload),
            refreshToken: this.generateRefreshToken(tokenPayload),
            expiresIn: config.accessTokenExpiry
        };
    }

    // 從請求頭中提取令牌
    static extractTokenFromHeader(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader) return null;
        
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) return null;
        
        return token;
    }

    // 將 token 加入黑名單
    static addToBlacklist(token) {
        if (!token) return;
        blacklist.add(token);
        return true;
    }
}

module.exports = { 
    JwtService, 
    config 
};