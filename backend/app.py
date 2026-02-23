from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt
import os
import json
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from flask import send_from_directory


app = Flask(__name__)
CORS(app)

# ---------------- FILE UPLOAD CONFIG ----------------
UPLOAD_FOLDER = "uploads"
CERT_FOLDER = os.path.join(UPLOAD_FOLDER, "certificates")
IMG_FOLDER = os.path.join(UPLOAD_FOLDER, "images")

os.makedirs(CERT_FOLDER, exist_ok=True)
os.makedirs(IMG_FOLDER, exist_ok=True)



# ---------------- DB CONNECTION ----------------
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="job_portal"
    )

@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# ---------------- REGISTER ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    name = data.get("name")
    phone = data.get("phone")
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")

    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute("SELECT id FROM users WHERE email=%s", (email,))
    if cur.fetchone():
        return jsonify({"status": "error", "message": "Email already exists"}), 400

    cur.execute("SELECT id FROM users WHERE username=%s", (username,))
    if cur.fetchone():
        return jsonify({"status": "error", "message": "Username already exists"}), 400

    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    cur.execute("""
        INSERT INTO users (name, phone, email, username, password)
        VALUES (%s, %s, %s, %s, %s)
    """, (name, phone, email, username, hashed_pw))

    db.commit()
    cur.close()
    db.close()

    return jsonify({"status": "success"}), 201

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute("""
        SELECT * FROM users
        WHERE username=%s OR email=%s
    """, (username, username))

    user = cur.fetchone()

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    if not bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        return jsonify({"status": "error", "message": "Incorrect password"}), 401

    cur.close()
    db.close()

    return jsonify({
        "status": "success",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "phone": user["phone"],
            "email": user["email"]
        }
    }), 200

# ---------------- FETCH USER + PROFILE ----------------
@app.route("/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute("""
        SELECT
            u.id,
            u.name,
            u.phone,
            u.email,
            p.father_name,
            p.gender,
            p.dob,
            p.education,
            p.skills,
            p.role,
            p.certificates,
            p.image_path,
            p.saved
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE u.id = %s
    """, (user_id,))

    data = cur.fetchone()
    cur.close()
    db.close()

    if not data:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "id": data["id"],
        "name": data["name"],
        "phone": data["phone"],
        "email": data["email"],
        "father_name": data["father_name"] or "",
        "gender": data["gender"] or "",
        "dob": data["dob"].isoformat() if data["dob"] else "",
        "education": json.loads(data["education"]) if data["education"] else [],
        "skills": json.loads(data["skills"]) if data["skills"] else [],
        "role": json.loads(data["role"]) if data["role"] else [],
        "certificates": json.loads(data["certificates"]) if data["certificates"] else [],
        "image_path": data["image_path"],
        "saved": bool(data["saved"]) if data["saved"] is not None else False
    }), 200

# ---------------- CREATE / UPDATE PROFILE ----------------
@app.route("/create-profile", methods=["POST"])
def create_profile():
    try:
        user_id = request.form.get("user_id")

        name = request.form.get("name")
        phone = request.form.get("phone")
        email = request.form.get("email")
        father_name = request.form.get("father_name")
        gender = request.form.get("gender")
        dob = request.form.get("dob")

        education = request.form.getlist("education")
        skills = request.form.getlist("skills")
        role = request.form.getlist("role")

        cert_files = request.files.getlist("certificates")
        img_file = request.files.get("image_path")

        # ---------- SAVE CERTIFICATES ----------
        cert_names = []
        for f in cert_files:
            if f and f.filename:
                filename = secure_filename(f.filename)
                f.save(os.path.join(CERT_FOLDER, filename))
                cert_names.append(filename)

        # ---------- SAVE IMAGE ----------
        img_path = None
        if img_file and img_file.filename:
            img_name = secure_filename(img_file.filename)
            img_path = os.path.join(IMG_FOLDER, img_name)
            img_file.save(img_path)

        db = get_db()
        cur = db.cursor()

        # ---------- CHECK PROFILE EXISTS ----------
        cur.execute("SELECT id FROM user_profiles WHERE user_id=%s", (user_id,))
        exists = cur.fetchone()

        if exists:
            cur.execute("""
                UPDATE user_profiles SET
                    father_name=%s,
                    gender=%s,
                    dob=%s,
                    education=%s,
                    skills=%s,
                    role=%s,
                    certificates=%s,
                    image_path=COALESCE(%s, image_path),
                    saved=1
                WHERE user_id=%s
            """, (
                father_name,
                gender,
                dob,
                json.dumps(education),
                json.dumps(skills),
                json.dumps(role),
                json.dumps(cert_names),
                img_path,
                user_id
            ))
        else:
            cur.execute("""
                INSERT INTO user_profiles
                (user_id, name, phone, email, father_name, gender, dob,
                 education, skills, role, certificates, image_path, saved)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,1)
            """, (
                user_id,
                name,
                phone,
                email,
                father_name,
                gender,
                dob,
                json.dumps(education),
                json.dumps(skills),
                json.dumps(role),
                json.dumps(cert_names),
                img_path
            ))

        db.commit()
        cur.close()
        db.close()

        return jsonify({"status": "success"}), 200

    except Exception as e:
        print("PROFILE ERROR:", e)
        return jsonify({"message": "Server error"}), 500






@app.route('/recruiter/register', methods=['POST'])
def recruiter_register():
    data = request.json

    required_fields = [
        'firstName', 'lastName', 'phone', 'email',
        'companyName', 'companyCode', 'username', 'password'
    ]

    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"success": False, "message": "All fields are required"}), 400

    hashed_password = generate_password_hash(data['password'])

    db = get_db()
    cur = db.cursor(dictionary=True)

    # check existing email
    cur.execute("SELECT id FROM recruiters WHERE email=%s", (data['email'],))
    if cur.fetchone():
        cur.close()
        db.close()
        return jsonify({"success": False, "message": "Email already exists"}), 409

    cur.execute("""
        INSERT INTO recruiters
        (first_name, last_name, phone, email, company_name, company_code, username, password)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        data['firstName'],
        data['lastName'],
        data['phone'],
        data['email'],
        data['companyName'],
        data['companyCode'],
        data['username'],
        hashed_password
    ))

    db.commit()
    cur.close()
    db.close()

    return jsonify({"success": True, "message": "Recruiter registered successfully"}), 201

@app.route('/recruiter/login', methods=['POST'])
def recruiter_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute("""
        SELECT id, first_name, company_name, password
        FROM recruiters
        WHERE email = %s
    """, (email,))

    recruiter = cur.fetchone()
    cur.close()
    db.close()

    if not recruiter:
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    if not check_password_hash(recruiter['password'], password):
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    return jsonify({
        "success": True,
        "message": "Login successful",
        "recruiter": {
            "id": recruiter["id"],
            "firstName": recruiter["first_name"],
            "company": recruiter["company_name"]
        }
    }), 200

@app.route("/post-job", methods=["POST"])
def post_job():
    try:
        company = request.form["company"]
        role = request.form["role"]
        location = request.form["location"]
        salary = request.form["salary"]
        description = request.form["description"]

        logo = request.files["logo"]

        filename = logo.filename
        logo.save(os.path.join(UPLOAD_FOLDER, filename))

        conn = get_db()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO jobs
            (company_name, role, location, salary, description, logo)
            VALUES (%s,%s,%s,%s,%s,%s)
        """, (company, role, location, salary, description, filename))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"status": "success"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


@app.route("/get-matching-jobs/<user_id>", methods=["GET"])
def get_matching_jobs(user_id):
    try:
        db = get_db()
        cur = db.cursor(dictionary=True)

        # ---------- GET USER ROLES ----------
        cur.execute("SELECT role FROM user_profiles WHERE user_id=%s", (user_id,))
        user = cur.fetchone()

        if not user:
            return jsonify([])

        # convert JSON string -> list
        user_roles = json.loads(user["role"])

        # normalize roles (lowercase + strip)
        user_roles = [r.strip().lower() for r in user_roles]

        # ---------- GET ALL JOBS ----------
        cur.execute("SELECT * FROM jobs")
        all_jobs = cur.fetchall()

        matched_jobs = []

        for job in all_jobs:
            job_role = job["role"].strip().lower()

            if job_role in user_roles:
                matched_jobs.append(job)

        cur.close()
        db.close()

        return jsonify(matched_jobs)

    except Exception as e:
        print("MATCH ERROR:", e)
        return jsonify([])



# ---------------- RUN ----------------


if __name__ == "__main__":
    app.run(debug=True)
