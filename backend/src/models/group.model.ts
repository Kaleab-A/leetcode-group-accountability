import mongoose, { Schema, Document } from 'mongoose';

// This represents a single member's stats
interface IMember {
  username: string;
  totalSolved: number;
  acceptanceRate: number;
  ranking: number;
  // Key is a string (Unix timestamp), value is number of submissions that day
  submissionCalendar: Record<string, number>;
}

export interface IGroup extends Document {
  groupID: string;
  groupName: string;
  members: IMember[];
}

const MemberSchema: Schema = new Schema({
  username: { type: String, required: true },
  totalSolved: { type: Number, default: 0 },
  acceptanceRate: { type: Number, default: 0 },
  ranking: { type: Number, default: 0 },
  submissionCalendar: { type: Map, of: Number, default: {} }
});

const GroupSchema: Schema = new Schema({
  groupID: { type: String, required: true },
  groupName: { type: String, default: 'Unnamed Group' },
  members: { type: [MemberSchema], default: [] }
});

export default mongoose.model<IGroup>('Group', GroupSchema);
