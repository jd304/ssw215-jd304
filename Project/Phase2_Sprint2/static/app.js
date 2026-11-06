const addBookButton = document.querySelector('.add-book-link');
const titleInput = document.getElementById('new-book');
const authorInput = document.getElementById('book-author');
const ratingInput = document.getElementById('book-rating');
const pageCountInput = document.getElementById('book-page-count');
const booksList = document.querySelector('.books-list');
const bookCount = document.getElementById('book-count');

let totalBooks = booksList ? booksList.querySelectorAll('.book-card').length : 0;

function makeBookCard(book) {
  const card = document.createElement('article');
  card.className = 'book-card';
  card.dataset.bookId = book.id;

  const title = document.createElement('h3');
  title.textContent = book.title;

  const author = document.createElement('p');
  author.className = 'book-meta';
  author.textContent = `Author: ${book.author}`;

  const pageCount = document.createElement('p');
  pageCount.className = 'book-meta';
  pageCount.textContent = `Page count: ${book.page_count}`;

  const rating = document.createElement('span');
  rating.className = 'book-rating';
  rating.textContent = `${book.rating} stars`;

  card.append(title, author, pageCount, rating);
  return card;
}

async function addBook() {
  titleInput.setCustomValidity('');
  authorInput.setCustomValidity('');
  ratingInput.setCustomValidity('');
  pageCountInput.setCustomValidity('');

  if (
    !titleInput.reportValidity()
    || !authorInput.reportValidity()
    || !ratingInput.reportValidity()
    || !pageCountInput.reportValidity()
  ) {
    return;
  }

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const ratingValue = ratingInput.value.trim();
  const rating = Number(ratingValue);
  const pageCountValue = pageCountInput.value.trim();
  const pageCount = Number(pageCountValue);

  if (!title || !author) {
    titleInput.setCustomValidity(title ? '' : 'Enter a book title.');
    authorInput.setCustomValidity(author ? '' : 'Enter an author name.');
    titleInput.reportValidity();
    authorInput.reportValidity();
    return;
  }

  if (!/^-?\d+$/.test(ratingValue) || !Number.isSafeInteger(rating)) {
    ratingInput.setCustomValidity('Enter a whole-number star rating.');
    ratingInput.reportValidity();
    return;
  }

  if (!/^\d+$/.test(pageCountValue) || !Number.isSafeInteger(pageCount)) {
    pageCountInput.setCustomValidity('Enter a non-negative whole-number page count.');
    pageCountInput.reportValidity();
    return;
  }

  try {
    const response = await fetch('/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author, rating, page_count: pageCount }),
    });
    if (!response.ok) {
      throw new Error(`Saving the book failed with status ${response.status}.`);
    }

    booksList.prepend(makeBookCard(await response.json()));
  } catch (error) {
    console.error('Unable to save the book.', error);
    window.alert('Unable to save the book. Please try again.');
    return;
  }

  totalBooks += 1;
  bookCount.textContent = String(totalBooks);

  titleInput.value = '';
  authorInput.value = '';
  ratingInput.value = '';
  pageCountInput.value = '';
  titleInput.focus();
}

if (addBookButton) {
  addBookButton.addEventListener('click', (event) => {
    event.preventDefault();
    addBook();
  });
}
