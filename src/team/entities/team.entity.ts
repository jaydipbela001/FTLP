import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";


@Schema({ timestamps: true })
export class Team {

    @Prop({ type: String, required: true })
    name: string

    // @Prop({ type: [mongoose.Schema.ObjectId], ref: 'Player' })
    // playes: mongoose.Types.ObjectId[]

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Player' })
    players: Types.ObjectId[];

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'Event' })
    eventId: Types.ObjectId[];

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
    userID: Types.ObjectId[];

}

export type TeamDocument = Team & Document

export const TeamSchema = SchemaFactory.createForClass(Team)


