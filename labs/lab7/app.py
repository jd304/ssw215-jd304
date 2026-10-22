from flask import Flask, jsonify, render_template

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
        "title": "video games",
        "description": "A collection of video game projects.",
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


@app.route("/api/projects/<int:project_id>/upvote", methods=["POST"])
def upvote_project(project_id):
    project = next(
        (project for project in projects_db if project["id"] == project_id),
        None,
    )
    if project is None:
        return jsonify({"error": "Project not found"}), 404

    project["likes"] += 1
    return jsonify({"id": project["id"], "likes": project["likes"]})


if __name__ == "__main__":
    app.run(debug=True)
