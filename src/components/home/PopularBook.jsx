import BooksNotFound from "../common/BooksNotFound";
import PopularSingleBook from "./PopularSingleBook";

const PopularBook = ({ popularBook }) => {
  return (
      <section className="my-28 w-11/12 mx-auto ">
      <h2 className="text-4xl font-bold text-center mb-8">Popular Books</h2>
      {popularBook?.length === 0 ? <BooksNotFound></BooksNotFound>
      :
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 [1600px]:grid-cols-4 gap-10">
        {popularBook.map((book) => (
          <PopularSingleBook key={book._id} book={book}></PopularSingleBook>
        ))}
      </div>}
    </section>
  );
};

export default PopularBook;
