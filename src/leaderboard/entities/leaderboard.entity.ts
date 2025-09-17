import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Leaderboard {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Team' })
    teamId: Types.ObjectId;

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

}

export type LeaderboardDocument = Leaderboard & Document

export const LeaderboardSchema = SchemaFactory.createForClass(Leaderboard)

