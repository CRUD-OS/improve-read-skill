import { Book } from "../../models/book-model";

export const getContent = async (
  _: unknown,
  args: {
    bookId?: string;
  }
) => {
  try {
    const texts = await Book.findById(args.bookId);

    if (!texts) {
      throw new Error("Failed to fetch questions");
    }

    return texts;
  } catch (error) {
    console.error("Error fetching texts:", error);
    throw new Error("Failed to fetch texts");
  }
};
