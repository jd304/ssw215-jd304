#SPEC: Devloping front end for project (book tracking app)

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
- All project data MUST live in a Python list of dictionaries named bookInfo_db in
app.py. templates/index.html MUST NOT contain a hardcoded project card.
- templates/index.html MUST render one card per book with a {% for %} loop.
- style.css and app.js MUST be linked with url_for('static', filename=...), never with a
plain relative path.
- No Jinja syntax ({{ }} or {% %}) may appear in static/app.js. External script files are
never processed by Flask.
- app.py MUST create the application with app = Flask(__name__), and MUST end with a
block that runs it with debug=True when the file is executed directly

## 3.UI Content & Interface Contract
- Header: the message "Welcome to Book Tracking", the subtitle "Insert your reading statistics and track your goals".
- Action link: a button labelled "See my books" that links to `#books`.
- Above the the button labelled "Add book" there MUST be a text input with id="new-book", and a <label>
bound to it reading "Enter book title".
- Below the text input there MUST be a text input with id="book-author", and a <label>
bound to it reading "Enter author name".
- Below the text input there MUST be a text input with id="book-rating", and a <label>
bound to it reading "Enter star rating for the book".
- Action link: a button labelled "Add book" that links to `#addBooks` located below the text inputs.
- The page MUST update immediately after buttons are pressed, no reload.
- Clicking the "Add book" button MUST add the inputs 
- There MUST be an element with id="book-count" that increases everytime the "Add book" button is pressed.
- Books section with id="Books": lists the inputed book information.
- After pressing the "Add book" button a card should appear under the Books section with the information that was inputed.  
- Each book in bookInfo MUST have the keys: id (an integer), title, author,
and rating (an integer).
- Each rendered card MUST carry the attribute data-book-id holding that books's id.
 Visiting http://127.0.0.1:5000/ MUST serve the page, with one card per entry in
bookInfo_db.
- The rendered cards MUST keep the same classes they had in SPrint 1, so that the existing
filter in app.js keeps working with no changes to app.js.

## 4. Acceptance Checklist
- [ ] Running app.py starts a server, and the page loads at http://127.0.0.1:5000/.
- [ ] Every card on the page comes from the {% for %} loop — index.html contains no
hardcoded card.
- [ ] Each card carries data-book-id with that book's id.
- [ ] Changing a title in app.py and reloading the page changes what I see.
- [ ] The page is styled — style.css and app.js both loaded.
- [ ] The DevTools Console shows no red errors

## 5. Audit Protocol
- Inspect the generated code line by line with `git diff --staged` before committing.



