import os
import json
import bcrypt
import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
import random, time
import traceback

app = Flask(__name__)
CORS(app, origins=["https://mathesh-jobskill.vercel.app"])

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get("MAIL_USER")
app.config['MAIL_PASSWORD'] = os.environ.get("MAIL_PASS")

mail = Mail(app)

otp_store = {}





# ======================================================
# ✅ DATABASE CONNECTION (Railway / Render ENV variables)
# ======================================================

def get_db():
    return mysql.connector.connect(
        host=os.environ.get("MYSQLHOST"),
        user=os.environ.get("MYSQLUSER"),
        password=os.environ.get("MYSQLPASSWORD"),
        database=os.environ.get("MYSQLDATABASE"),
        port=int(os.environ.get("MYSQLPORT"))
    )


# ======================================================
# ✅ HOME
# ======================================================

@app.route("/")
def home():
    return "Skill Nexus Backend Running 🚀"

@app.route("/test")
def test():
    return "API OK"
# ======================================================
# ✅ USER REGISTER
# ======================================================

@app.route("/register", methods=["POST"])
def register():

    data = request.json

    name = data["name"]
    phone = data["phone"]
    email = data["email"]
    username = data["username"]
    password = data["password"]

    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO users (name, phone, email, username, password)
            VALUES (%s,%s,%s,%s,%s)
        """, (name, phone, email, username, hashed_password))

        conn.commit()

        # ✅ SEND MAIL HERE (before return)
        msg = Message(
            "Welcome to SkillLearn 🎉",
            sender=app.config['MAIL_USERNAME'],
            recipients=[email]
        )
        msg.body = "Your account created successfully!"
        mail.send(msg)

        return jsonify({"message": "User registered successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 400

    finally:
        cursor.close()
        conn.close()
# ======================================================
# ✅ USER LOGIN
# ======================================================

@app.route("/login", methods=["POST"])
def login():

    data = request.json

    username = data["username"]
    password = data["password"]

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 401

    # ✅ bcrypt FIX (no encode on DB password)
    if bcrypt.checkpw(password.encode(), user["password"]):
        return jsonify({
            "message": "Login success",
            "user_id": user["id"]
        })

    return jsonify({"error": "Invalid password"}), 401

# =========================
# ✅ GET USER BASIC INFO
# =========================
@app.route("/get-user/<int:user_id>")
def get_user(user_id):

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT name, phone, email FROM users WHERE id=%s",
        (user_id,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(user or {})
# ======================================================
# ✅ SAVE USER PROFILE
# ======================================================

@app.route("/save-profile/<int:user_id>", methods=["POST"])
def save_profile(user_id):

    try:
        data = request.get_json(force=True) or {}

        conn = get_db()
        cursor = conn.cursor()

        education = json.dumps(data.get("education", []))
        skills = json.dumps(data.get("skills", []))
        role = json.dumps(data.get("role", []))

        cursor.execute("""
            INSERT INTO user_profiles
            (user_id,name,phone,email,father_name,gender,dob,
             education,skills,role,certificates,image_path,saved)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,1)
            ON DUPLICATE KEY UPDATE
             name=VALUES(name),
             phone=VALUES(phone),
             email=VALUES(email),
             father_name=VALUES(father_name),
             gender=VALUES(gender),
             dob=VALUES(dob),
             education=VALUES(education),
             skills=VALUES(skills),
             role=VALUES(role),
             certificates=VALUES(certificates),
             image_path=VALUES(image_path),
             saved=1
        """, (
            user_id,
            str(data.get("name","")),
            str(data.get("phone","")),
            str(data.get("email","")),
            str(data.get("father_name","")),
            str(data.get("gender","")),
            str(data.get("dob","")),
            education,
            skills,
            role,
            "[]",
            str(data.get("image_path",""))
        ))

        conn.commit()

        return jsonify({"message": "Profile saved"})

    except Exception as e:
        print("SAVE PROFILE ERROR:", e)   # shows in logs
        return jsonify({"error": str(e)}), 500

# ======================================================
# ✅ GET PROFILE
# ======================================================

@app.route("/get-profile/<int:user_id>")
def get_profile(user_id):

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM user_profiles WHERE user_id=%s", (user_id,))
    profile = cursor.fetchone()

    cursor.close()
    conn.close()

    if not profile:
        return jsonify({})

    # convert JSON fields
    for field in ["education", "skills", "role", "certificates"]:
        if profile[field]:
            profile[field] = json.loads(profile[field])

    return jsonify(profile)


# ======================================================
# ✅ RECRUITER REGISTER
# ======================================================

@app.route("/recruiter/register", methods=["POST"])
def recruiter_register():

    data = request.json

    hashed_password = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO recruiters
        (first_name,last_name,phone,email,company_name,company_code,username,password)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        data["first_name"],
        data["last_name"],
        data["phone"],
        data["email"],
        data["company_name"],
        data["company_code"],
        data["username"],
        hashed_password
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Recruiter registered"})


# ======================================================
# ✅ RECRUITER LOGIN
# ======================================================

@app.route("/recruiter/login", methods=["POST"])
def recruiter_login():

    data = request.json

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM recruiters WHERE username=%s",
        (data["username"],)
    )

    recruiter = cursor.fetchone()

    cursor.close()
    conn.close()

    if recruiter and bcrypt.checkpw(data["password"].encode(), recruiter["password"]):
        return jsonify({
            "message": "Login success",
            "recruiter_id": recruiter["id"]
        })

    return jsonify({"error": "Invalid login"}), 401


# ======================================================
# ✅ CREATE JOB
# ======================================================

@app.route("/post-job", methods=["POST"])
def post_job():

    data = request.json

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO jobs
        (company_name, role, location, salary, description, logo)
        VALUES (%s,%s,%s,%s,%s,%s)
    """, (
        data["company_name"],
        data["role"],
        data["location"],
        data["salary"],
        data["description"],
        data["logo"]
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Job posted"})


# ======================================================
# ✅ GET JOBS
# ======================================================

@app.route("/jobs")
def get_jobs():

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM jobs ORDER BY id DESC")
    jobs = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(jobs)


@app.route("/send-otp", methods=["POST", "OPTIONS"])
def send_otp():

    if request.method == "OPTIONS":
        return "", 200   # preflight safe

    try:
        email = request.json["email"]

        otp = str(random.randint(100000, 999999))
        expiry = time.time() + 300

        otp_store[email] = (otp, expiry)

        msg = Message(
            "SkillLearn OTP",
            sender=app.config['MAIL_USERNAME'],
            recipients=[email]
        )
        msg.body = f"Your OTP: {otp}"

        mail.send(msg)

        return jsonify({"message": "OTP sent"})

    except Exception as e:
      traceback.print_exc()
    return jsonify({"error": str(e)}), 500
    
    
@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    email = request.json["email"]
    otp = request.json["otp"]

    if email not in otp_store:
        return {"success": False}, 400

    saved, expiry = otp_store[email]

    if time.time() > expiry or saved != otp:
        return {"success": False}, 400

    del otp_store[email]
    return {"success": True}

# ======================================================
# ✅ RUN (Local only)
# ======================================================

