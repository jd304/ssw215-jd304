import json
from pathlib import Path

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

BOOKS_FILE = Path(__file__).resolve().parent / "books.json"


def load_books():
    with BOOKS_FILE.open(encoding="utf-8") as books_file:
        books = json.load(books_file)
    if not isinstance(books, list):
        raise ValueError("books.json must contain a list of books")
    return books


def save_books(bookInfo_db):
    with BOOKS_FILE.open("w", encoding="utf-8") as books_file:
        json.dump(bookInfo_db, books_file, indent=2)


@app.route("/")
def index():
    bookInfo_db = load_books()
    return render_template("index.html", books=bookInfo_db)


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

    rating = submitted_book.get("rating")
    if type(rating) is not int:
        return jsonify(error="An integer rating is required."), 400

    bookInfo_db = load_books()
    new_book = {
        "id": max((book["id"] for book in bookInfo_db), default=0) + 1,
        "title": title.strip(),
        "author": author.strip(),
        "rating": rating,
    }
    bookInfo_db.append(new_book)
    save_books(bookInfo_db)
    return jsonify(new_book), 201


if __name__ == "__main__":
    app.run(debug=True)
