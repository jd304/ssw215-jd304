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
## 3. UI Content & Interface Contract
- Hero header: my full name "Jillian", the subtitle "student in SSW-215", and
this bio: "software engineering major".
- Action link: a button labelled "See my projects" that links to `#projects`.
- Projects section with id="projects": lists these items: book tracking app, video games, and study app.
- Social link: GitHub ([<your GitHub profile URL>](https://github.com/jd304)) MUST open in a new tab
(target="_blank").
- The page background MUST be dark navy (#1b2a41) with white text.
## 4. Acceptance Checklist
- [ X] Valid semantic HTML5: the page uses <header>, <main>, and <footer>.
- [ X] The avatar image has width, height, and alt attributes.
- [ X] No horizontal scrollbar when the browser is narrowed to 375px.
- [ X] The GitHub link opens in a new tab and has rel="noopener".
- [ X] No placeholder links: href="#" appears nowhere.
## 5. Audit Protocol
- Inspect the generated code line by line with `git diff --staged` before committing.