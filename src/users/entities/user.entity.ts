import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { Document } from "mongoose";

@Schema({ timestamps: true })
export class User {

    @Prop({ type: String, required: true, unique: true })
    email: string

    @Prop({ type: String, required: true })
    password: string

    @Prop({ type: String, default: null })
    firstname: string

    @Prop({ type: String, default: null })
    lastname: string

    @Prop({ type: String, default: null })
    country: string

    @Prop({ type: String, default: null })
    gender: string

    @Prop({ type: Date, default: null })
    age: Date

    @Prop({ type: Number, default: null })
    otp: number | null

    @Prop({ type: String, default: null })
    otpToken: string | null

    @Prop({ type: Date, default: null })
    otpSendDate: Date | null

    @Prop({ default: false })
    forgotPassword: boolean

    @Prop({ type: String, default: null })
    profileImage: string

    @Prop({ type: String, default: null })
    caption: string

    @Prop({ type: String, default: 'user' })
    role: string
}

export type UserDocument = User & Document

export const UserSchema = SchemaFactory.createForClass(User)

