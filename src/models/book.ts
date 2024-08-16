import { Schema, model, Document, Types } from 'mongoose';

interface IBook extends Document {
  _id: Types.ObjectId;
  title: string;
  author: string;
  description: string;
  available: boolean;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  available: { type: Boolean, default: true },
});

const Book = model<IBook>('Book', bookSchema);
export default Book;
