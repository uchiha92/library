import { Book } from "./book";

export interface BookFormDialogData {
  title: string;
  book: Book | null;
}
