import json
from pathlib import Path

from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)
database_path = Path(app.instance_path) / "portfolio.db"
database_path.parent.mkdir(parents=True, exist_ok=True)
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{database_path.as_posix()}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=False, default="")
    likes = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "likes": self.likes,
        }


def init_seed_data():
    if Project.query.first() is not None:
        return

    seed_path = Path(__file__).with_name("projects_seed.json")
    with seed_path.open(encoding="utf-8") as seed_file:
        projects = json.load(seed_file)

    db.session.add_all(
        Project(
            id=project["id"],
            title=project["title"],
            description=project["description"],
            likes=project["likes"],
        )
        for project in projects
    )
    try:
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        raise


@app.route("/")
def index():
    projects = Project.query.order_by(Project.id).all()
    return render_template("index.html", projects=projects)


@app.route("/api/projects", methods=["GET"])
def get_projects():
    projects = Project.query.order_by(Project.id).all()
    return jsonify([project.to_dict() for project in projects])


@app.route("/api/projects/<int:project_id>/upvote", methods=["POST"])
def upvote_project(project_id):
    project = db.session.get(Project, project_id)
    if project is None:
        return jsonify({"error": "Project not found"}), 404

    project.likes += 1
    try:
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({"error": "Unable to update project"}), 400

    return jsonify({"id": project.id, "likes": project.likes})


@app.route("/api/projects", methods=["POST"])
def create_project():
    data = request.get_json(silent=True)
    title = data.get("title") if isinstance(data, dict) else None
    if not isinstance(title, str) or not title.strip():
        return jsonify({"error": "A non-empty title is required"}), 400

    title = title.strip()
    if len(title) > 120:
        return jsonify({"error": "Title must be 120 characters or fewer"}), 400

    project = Project(title=title, description="", likes=0)
    db.session.add(project)
    try:
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({"error": "A project with that title already exists"}), 400 

    return jsonify(project.to_dict()), 201


with app.app_context():
    db.create_all()
    init_seed_data()


if __name__ == "__main__":
    app.run(debug=True)
