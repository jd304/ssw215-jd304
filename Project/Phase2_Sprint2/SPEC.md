#SPEC: Devloping front end and backend for project (book tracking app)

## 1. Purpose and Scope
- a book trcking app for a single user.
- Non-Goals: no multi-page routing; no backend; no contact forms, no multiuser interface. 

## 2. Invariants and Negative Constraints
- All styling MUST reside in `./style.css` (no inline style="..." attributes).
- The page MUST NOT load external CSS frameworks or CDNs (no Bootstrap, no Tailwind).
- All JavaScript MUST live in ./app.js. index.html MUST NOT contain inline onclick
attributes or any <script> block with code inside it.
- Spacing and font sizes MUST use rem. px MAY be used only for borders.
- app.js MUST be loaded from <head> with <script src="./app.js" defer></script>.
- style.css MUST begin with the universal reset: `*, *::before, *::after { box-sizing:
border-box; }`.
- Styling MUST use class selectors. ID selectors MUST NOT be used for styling.
- Showing and hiding MUST be done by adding and removing a CSS class. app.js MUST NOT set
styles directly through .style.
- All book data MUST live in a Python list of dictionaries named bookInfo_db in
app.py. templates/index.html MUST NOT contain a hardcoded book card.
- templates/index.html MUST render one card per book with a {% for %} loop.
- style.css and app.js MUST be linked with url_for('static', filename=...), never with a
plain relative path.
- No Jinja syntax ({{ }} or {% %}) may appear in static/app.js. External script files are
never processed by Flask.
- app.py MUST create the application with app = Flask(__name__), and MUST end with a
block that runs it with debug=True when the file is executed directly
- books.json MUST be the only source of book data. app.py MUST NOT contain a
hardcoded list of books.
- The path to book.json MUST be built from the location of app.py, not from a bare
relative path.
- Every route that changes a book MUST write the whole list back to books.json
before it returns a response.
- books.json MUST be written with json.dump(..., indent=2) so it stays readable in a
diff.
- A create request whose title or author is missing, or is empty once surrounding spaces are
removed, MUST be rejected by the server with status code 400, and the rejection MUST
happen before books.json is opened.
- The new books's id MUST be one higher than the largest id already in the file.
- All book data MUST live in a SQLite database managed by Flask-SQLAlchemy. app.py
MUST NOT read or write books_seed.json at runtime, except when seeding an empty
database.
- The book model MUST declare id as the primary key, title as db.String(120) with
nullable=False and unique=True, page count as db.Integer, and rating as db.Integer.
- The database MUST be created by db.create_all() inside an app.app_context() block when
the server starts.
- init_seed_data() MUST insert the books from books_seed.json only when the
books table is empty, so restarting the server never duplicates rows.
- Any commit the database refuses MUST be followed by db.session.rollback(), and the
route MUST return 400 with a JSON error rather than crashing.


## 3.UI Content & Interface Contract
- Header: the message "Welcome to Book Tracking", the subtitle "Insert your reading statistics and track your goals".
- Action link: a button labelled "See my books" that links to `#books`.
- Above the the button labelled "Add book" there MUST be a text input with id="new-book", and a <label>
bound to it reading "Enter book title".
- Below the text input there MUST be a text input with id="book-author", and a <label>
bound to it reading "Enter author name".
- Below the text input there MUST be a text input with id="book-rating", and a <label>
bound to it reading "Enter star rating for the book".
- Below the text input there MUST be a text input with id="book-page-count", and a <label>
bound to it reading "Enter page count for the book".
- Action link: a button labelled "Add book" that links to `#addBooks` located below the text inputs.
- The page MUST update immediately after buttons are pressed, no reload.
- Clicking the "Add book" button MUST add the inputs 
- There MUST be an element with id="book-count" that increases everytime the "Add book" button is pressed.
- Books section with id="Books": lists the inputed book information.
- After pressing the "Add book" button a card should appear under the Books section with the information that was inputed.  
- Each book in bookInfo MUST have the keys: id (an integer), title, author,
and rating (an integer), page count (an integer).
- Each rendered card MUST carry the attribute data-book-id holding that books's id.
 Visiting http://127.0.0.1:5000/ MUST serve the page, with one card per entry in
bookInfo_db.
- The rendered cards MUST keep the same classes they had in Sprint 1, so that the existing
filter in app.js keeps working with no changes to app.js.
- app.py MUST read books.json and pass the resulting list to the template, so the page
shows whatever the file currently contains.
- A successful create MUST return the new book as JSON with status code 201 in the network tab.
- All codes must appear in the Networks tab.
- The page MUST still be rendered by Jinja from templates/index.html, with the book
list coming from a database query.
- GET /api/book MUST return every book as a JSON array with status code 200, built
from each book's to_dict() method.
-Adding a book MUST write to the database instead of a file
## 4. Acceptance Checklist
- [ X] Starting the server creates instance/bookTracking.db, and the page shows the books
that were in books_seed.json.
- [X ] Restarting the server does not duplicate any book.
- [X ] Opening http://127.0.0.1:5000/api/books in the browser shows the books as
JSON.
- [ X] instance/ and *.db are ignored by Git and do not appear in git status.

## 5. Audit Protocol
- Inspect the generated code line by line with `git diff --staged` before committing.



