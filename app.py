from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

DATA_FILE = "courses.json"


def load_courses():
    if not os.path.exists(DATA_FILE):
        return []

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_courses(courses):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(courses, f, indent=4)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route("/api/courses", methods=["GET"])
def get_courses():
    return jsonify(load_courses())


@app.route("/api/courses", methods=["POST"])
def add_course():

    data = request.json

    courses = load_courses()

    new_course = {
        "id": len(courses) + 1,
        "title": data["title"],
        "level": data["level"]
    }

    courses.append(new_course)

    save_courses(courses)

    return jsonify(new_course), 201


@app.route("/api/courses/<int:id>", methods=["PUT"])
def update_course(id):

    data = request.json

    courses = load_courses()

    for course in courses:

        if course["id"] == id:

            course["title"] = data["title"]

            course["level"] = data["level"]

            save_courses(courses)

            return jsonify(course)

    return jsonify({"error": "Course not found"}), 404


@app.route("/api/courses/<int:id>", methods=["DELETE"])
def delete_course(id):

    courses = load_courses()

    courses = [c for c in courses if c["id"] != id]

    save_courses(courses)

    return jsonify({"message": "Course deleted"})


if __name__ == "__main__":
    app.run(debug=True)