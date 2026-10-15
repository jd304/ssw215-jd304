from flask import Flask, render_template

app = Flask(__name__)

projects_db = [
    {
        "id": 1,
        "title": "book tracking app",
        "description": "A simple way to keep track of books.",
        "likes": 0,
    },
    {
        "id": 2,
        "title": "TO-DO list app",
        "description": "A place to store things that you need to do.",
        "likes": 0,
    },
    {
        "id": 3,
        "title": "study app",
        "description": "An app to help organize study sessions.",
        "likes": 0,
    },
    { #hand edited by JD
        "id": 4,#hand edited by JD
        "title": "exercise tracking app",#hand edited by JD
        "description": "An app to help organize track how active the user is.",#hand edited by JD
        "likes": 0,#hand edited by JD
    }#hand edited by JD
]


@app.route("/")
def index():
    return render_template("index.html", projects=projects_db)


if __name__ == "__main__":
    app.run(debug=True)
