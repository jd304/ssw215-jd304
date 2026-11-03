from flask import Flask, render_template

app = Flask(__name__)

books_db = []
bookInfo_db = books_db


@app.route("/")
def index():
    return render_template("index.html", books=books_db)


if __name__ == "__main__":
    app.run(debug=True)
