import mongoose from "mongoose";

const JournalEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: String,
  date: { type: Date, default: Date.now },
  type: { type: String, default: "user" }, // user or bot
});

export default mongoose.model("JournalEntry", JournalEntrySchema);
