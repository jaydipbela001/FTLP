import { addMinutes } from "date-fns"
import * as jwt from 'jsonwebtoken';

export function generateJwtToken(userID: string, role: string): string {
    return jwt.sign({ id: userID, role: role }, process.env.JWT_SECRET_KEY || " ", { expiresIn: process.env.JWT_EXPIRES_IN });
}

export function timeToseconds(timestr: number): number {
    const seconds = timestr * 60;
    return seconds;
}

export function dateToMilliseconds(datestr: Date): number {
    const date = new Date(datestr);
    return date.getTime();
}

export const OTP_FUNCTION = {

    getOtpExpiryDate: (): Date => addMinutes(new Date(), 2),

    // generateOtp: (): number => 1111

    generateOtp: (): number => {
        return Math.floor(1000 + Math.random() * 9000);
    },

}
