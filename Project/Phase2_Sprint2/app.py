import json
from pathlib import Path

from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect, text
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///bookTracking.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
SEED_FILE = Path(__file__).resolve().parent / "books_seed.json"


class Book(db.Model):
    __tablename__ = "books"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False, unique=True)
    author = db.Column(db.String(120), nullable=False)
    page_count = db.Column(db.Integer, nullable=False, default=0)
    rating = db.Column(db.Integer)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "page_count": self.page_count,
            "rating": self.rating,
        }


def init_seed_data():
    if db.session.query(Book.id).first() is not None:
        return

    with SEED_FILE.open(encoding="utf-8") as seed_file:
        seed_books = json.load(seed_file)
    if not isinstance(seed_books, list):
        raise ValueError("books_seed.json must contain a list of books")

    seeded_titles = set()
    for seed_book in seed_books:
        title = seed_book["title"]
        if title in seeded_titles:
            continue
        seeded_titles.add(title)
        db.session.add(
            Book(
                id=seed_book["id"],
                title=title,
                author=seed_book["author"],
                page_count=seed_book.get("page_count", 0),
                rating=seed_book["rating"],
            )
        )
    try:
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        raise


Path(app.instance_path).mkdir(parents=True, exist_ok=True)
with app.app_context():
    existing_tables = set(inspect(db.engine).get_table_names())
    if "projects" in existing_tables and "books" not in existing_tables:
        with db.engine.begin() as connection:
            connection.execute(text("ALTER TABLE projects RENAME TO books"))
    db.create_all()
    book_columns = {column["name"] for column in inspect(db.engine).get_columns("books")}
    if "page_count" not in book_columns:
        with db.engine.begin() as connection:
            connection.execute(
                text("ALTER TABLE books ADD COLUMN page_count INTEGER NOT NULL DEFAULT 0")
            )
    init_seed_data()


@app.route("/")
def index():
    bookInfo_db = [
        book.to_dict() for book in Book.query.order_by(Book.id).all()
    ]
    return render_template("index.html", books=bookInfo_db)


@app.route("/api/books")
@app.route("/api/book")
@app.route("/api/projects")
def get_books():
    books = Book.query.order_by(Book.id).all()
    return jsonify([book.to_dict() for book in books]), 200


@app.route("/books", methods=["POST"])
def add_book():
    submitted_book = request.get_json(silent=True)
    if not isinstance(submitted_book, dict):
        return jsonify(error="A book object is required."), 400

    title = submitted_book.get("title")
    author = submitted_book.get("author")
    if (
        not isinstance(title, str)
        or not title.strip()
        or not isinstance(author, str)
        or not author.strip()
    ):
        return jsonify(error="A non-empty title and author are required."), 400

    title = title.strip()
    author = author.strip()
    if len(title) > 120 or len(author) > 120:
        return jsonify(error="Title and author must be 120 characters or fewer."), 400

    rating = submitted_book.get("rating")
    if type(rating) is not int:
        return jsonify(error="An integer rating is required."), 400

    page_count = submitted_book.get("page_count")
    if type(page_count) is not int or page_count < 0:
        return jsonify(error="A non-negative integer page count is required."), 400

    book = Book(title=title, author=author, page_count=page_count, rating=rating)
    db.session.add(book)
    try:
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify(error="Unable to save the book."), 400

    return jsonify(book.to_dict()), 201


if __name__ == "__main__":
    app.run(debug=True)
