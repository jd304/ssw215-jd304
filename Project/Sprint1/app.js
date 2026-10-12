const addBookButton = document.querySelector('.add-book-link');
const titleInput = document.getElementById('new-book');
const authorInput = document.getElementById('book-author');
const ratingInput = document.getElementById('book-rating');
const booksList = document.querySelector('.books-list');
const bookCount = document.getElementById('book-count');

let totalBooks = 0;

function makeBookCard(bookTitle, bookAuthor, bookRating) {
  const card = document.createElement('article');
  card.className = 'book-card';

  const title = document.createElement('h3');
  title.textContent = bookTitle;

  const author = document.createElement('p');
  author.className = 'book-meta';
  author.textContent = `Author: ${bookAuthor}`;

  const rating = document.createElement('span');
  rating.className = 'book-rating';
  rating.textContent = `${bookRating} stars`;

  card.append(title, author, rating);
  return card;
}

function addBook() {
  const title = titleInput.value.trim() || 'Untitled book';
  const author = authorInput.value.trim() || 'Unknown author';
  const rating = ratingInput.value.trim() || '0';

  booksList.prepend(makeBookCard(title, author, rating));
  totalBooks += 1;
  bookCount.textContent = String(totalBooks);

  titleInput.value = '';
  authorInput.value = '';
  ratingInput.value = '';
  titleInput.focus();
}

if (addBookButton) {
  addBookButton.addEventListener('click', addBook);
}
