import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from "nodemailer"
import { Messages } from 'src/common/messages';

@Injectable()

export class Mailservice {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'jaydipbela001@gmail.com',
                pass: 'aibx vfyc gauw maum'
            },
        });
    }

    async sendOtpEmail(to: string, username: string, otp: number): Promise<SentMessageInfo> {
        try {
            this.transporter.sendMail({
                to,
                subject: Messages.AUTH.SEND_OTP_EMAIL,
                text: username === null ? Messages.AUTH.OTP_EMAIL_TEXT_NAME(otp) : Messages.AUTH.OTP_EMAIL_TEXT(username, otp)
            })
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}