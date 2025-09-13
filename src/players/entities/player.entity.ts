import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { Document } from "mongoose";

@Schema({ timestamps: true })
export class Player {

    @Prop({ type: String, required: true })
    name: string

    @Prop({ type: String, required: true })
    surname: string

    @Prop({ type: String, required: true })
    profileImage: string

    @Prop({ type: String, required: true })
    city: string

    @Prop({ type: String, required: true })
    state: string

    @Prop({ type: String, required: true })
    country: string

    @Prop({ type: Date, required: true })
    dob: Date

    @Prop({ type: String, required: true })
    gender: string
}

export type PlayerDocument = Player & Document

export const PlayerSchema = SchemaFactory.createForClass(Player)

