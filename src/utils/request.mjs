import dotenv from 'dotenv';

dotenv.config();

export const tatumRequest = (url, options) => {
    return fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.TATUM_API_KEY
        },
        ...options
    })
}