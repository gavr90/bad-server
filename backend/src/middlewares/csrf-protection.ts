// eslint-disable-next-line import/no-extraneous-dependencies
import { doubleCsrf, DoubleCsrfConfigOptions } from 'csrf-csrf'

const doubleCsrfOptions: DoubleCsrfConfigOptions = {
    getSecret: () => process.env.CSRF_SECRET || '___Secret___',
    cookieName: process.env.CSRF_COOKIE_NAME || '__Host-larek.x-csrf-token',
    cookieOptions: {
        sameSite: 'strict',
        path: '/',
        secure: process.env.CSRF_COOKIE_IS_SECURE
            ? process.env.CSRF_COOKIE_IS_SECURE.toUpperCase() === 'TRUE'
            : true,
    },
}

export const { doubleCsrfProtection, generateToken } =
    doubleCsrf(doubleCsrfOptions)