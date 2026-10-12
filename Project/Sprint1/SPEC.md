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

## 4. Acceptance Checklist
- [ ] app.js is loaded from <head> with defer, and index.html has no inline onclick and
no code inside a <script> tag.
- [ ] Clicking the buttons updates the page without reloading it.
- [ ] app.js contains no .style assignments.
- [ ] The DevTools Console shows no red errors when the page loads.
- [ ] Clikcing the "add books" button adds a new card to the books section.

## 5. Audit Protocol
- Inspect the generated code line by line with `git diff --staged` before committing.



