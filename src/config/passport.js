const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
const logger = require('../utils/logger');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

passport.use('google-frontend', 
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_HOST}${process.env.GOOGLE_CALLBACK_URL}` ||`https://psp-api-1083228059547.asia-east1.run.app/auth/google/callback`,
        scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log('frontend callback');
        try {
            const email = profile.emails[0].value;
            const name = profile.displayName;

            // 查找用戶
            const existingUser = await User.findOne({ where: { email } });

            // 如果用戶不存在, 回傳訊息給前端
            if (!existingUser) {
                logger.info('User not found');
                return done(null, false, { 
                    message: '此 Google 帳號尚未註冊',
                    email: email,
                    name: name
                });
            }

            // 將 Google profile 資訊添加到用戶對象
            existingUser.googleId = profile.id;
            existingUser.provider = 'google';

            return done(null, existingUser);

        } catch (error) {
            logger.error('Google authentication error:', error);
            return done(error, null);
        }
    }
));

passport.use('google-backend', 
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_HOST}/admin/google/callback` ||`https://psp-api-1083228059547.asia-east1.run.app/admin/google/callback`,
        scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log('backend callback');
        try {
            const email = profile.emails[0].value;
            const name = profile.displayName;

            // 查找用戶
            const existingUser = await User.findOne({ where: { email } });

            // 如果用戶不存在, 回傳訊息給前端
            if (!existingUser) {
                logger.info('User not found');
                return done(null, false, { 
                    message: '此 Google 帳號尚未註冊',
                    email: email,
                    name: name
                });
            }

            // 如果用戶的權限不是 admin, 回傳訊息給前端
            if (existingUser.role !== 'admin') {
                logger.info('User is not admin');
                return done(null, false, { 
                    message: '您沒有權限進行此操作',
                });
            }

            // 將 Google profile 資訊添加到用戶對象
            existingUser.googleId = profile.id;
            existingUser.provider = 'google';

            return done(null, existingUser);

        } catch (error) {
            logger.error('Google authentication error:', error);
            return done(error, null);
        }
    }
));

// 序列化用戶
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// 反序列化用戶
passport.deserializeUser(async (id, done) => {
    try {
        const [user] = await sequelize.query(
            `SELECT 
                id, 
                email, 
                username, 
                is_verified 
             FROM users 
             WHERE id = :userId`,
            {
                replacements: { userId: id },
                type: QueryTypes.SELECT
            }
        );
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport; 