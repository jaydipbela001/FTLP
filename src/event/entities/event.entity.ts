import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";


@Schema({ timestamps: true })
export class Event {

    @Prop({ type: String })
    title: string

    @Prop({ type: String })
    description: string

    @Prop({ type: String })
    location: string

    @Prop({ type: Number })
    startdate: number

    // @Prop({ type: [mongoose.Schema.ObjectId], default: [], ref: 'Player' })
    // playerlist: mongoose.Types.ObjectId[]

    @Prop({ type: [mongoose.Schema.ObjectId], default: [], ref: 'Player' })
    playerlist: Types.ObjectId[]

    @Prop({ type: Number })
    runkm: number

    @Prop({ type: Number })
    bikekm: number

    @Prop({ type: Number })
    swimkm: number

    @Prop({ type: Number })
    runtime: number

    @Prop({ type: Number })
    biketime: number

    @Prop({ type: Number })
    swimtime: number
}

export type EventDocument = Event & Document

export const EventSchema = SchemaFactory.createForClass(Event)

