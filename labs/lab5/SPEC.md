# SPEC: Developer Portfolio Welcome Page
## 1. Purpose & Scope
- A personal portfolio welcome page for Jillian, a first-year software
engineering student.
- Non-Goals: no multi-page routing; no backend; no contact forms.
## 2. Invariants & Negative Constraints
- All styling MUST reside in `./style.css` (no inline style="..." attributes).
- The page MUST NOT load external CSS frameworks or CDNs (no Bootstrap, no Tailwind).
- The avatar image MUST use the relative path `assets\avatar.jpeg`.
- The layout MUST collapse into a single vertical column on screens narrower than 768px.
- style.css MUST begin with the universal reset: `*, *::before, *::after { box-sizing:
border-box; }`.
- Spacing and font sizes MUST use rem. px MAY be used only for borders.
- Styling MUST use class selectors. ID selectors MUST NOT be used for styling.
## 3. UI Content & Interface Contract
- Hero header: my full name "Jillian", the subtitle "student in SSW-215", and
this bio: "software engineering major".
- Action link: a button labelled "See my projects" that links to `#projects`.
- Projects section with id="projects": lists these items: book tracking app, video games, and study app.
- Social link: GitHub ([<your GitHub profile URL>](https://github.com/jd304)) MUST open in a new tab
(target="_blank").
- The page background MUST be dark navy (#1b2a41) with white text.
- The page MUST use semantic landmarks: one <header>, one <nav>, one <main>, one
<footer>, and each content group inside its own <section> with a heading.
- There MUST be exactly one <h1>, and heading levels MUST NOT skip (h1 then h2 then h3).
- <nav> MUST contain a link to the projects section and a link to my GitHub profile.
- Each project MUST be an <article class="card"> inside a container that uses display:
flex, flex-wrap: wrap and gap.
- The "See my projects" button MUST have four visually distinct states: :hover, :focus-
visible, :active, and :disabled.
- A second button labelled "Contact me (coming soon)" MUST be present with the HTML
disabled attribute, and MUST NOT look clickable.
- All four state rules MUST live in style.css.
## 4. Acceptance Checklist
- [ X] Exactly one <h1>, one <header>, one <nav>, one <main>, one <footer>.
- [X ] Every project is an <article class="card"> inside a flex container with gap.
- [X ] style.css begins with the box-sizing reset.
- [X ] No inline style="..." attributes anywhere in index.html.
- [X ] No ID selectors (#something) in style.css.
- [X ] No horizontal scrollbar when the browser is narrowed to 375px.
- [X ] Hovering the primary button visibly changes it.
- [X ] Tabbing to the primary button shows a clear focus ring.
- [X ] Holding the mouse down on it looks different again.
- [X ] The disabled button looks unavailable and does not react to hover.
## 5. Audit Protocol
- Inspect the generated code line by line with `git diff --staged` before committing.