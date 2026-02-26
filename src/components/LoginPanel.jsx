import { useState, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";



const navigate = useNavigate();

const LoginPanel = ({ isOpen, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  //Loader
  const [showLoader, setShowLoader] = useState(false);

  // ---------- REGISTER FIELDS ----------
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ---------- LOGIN FIELDS ----------
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});




  const nameRef = useRef(null);

  const fieldOrder = [
    "name",
    "phone",
    "email",
    "username",
    "password",
    "confirmPassword",
  ];

  // ---------- VALIDATION ----------
  const validateUsername = (v) =>
    !/^[A-Za-z0-9]+$/.test(v)
      ? "Only letters & numbers allowed — no spaces"
      : "";

  const validateName = (v) =>
    !/^[A-Za-z ]+$/.test(v) ? "Only alphabets & spaces allowed" : "";

  const validatePhone = (v) =>
    !/^[0-9]{10}$/.test(v) ? "Phone number must be 10 digits" : "";

  const validateEmail = (v) =>
    !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(v)
      ? "Email must end with @gmail.com"
      : "";

  const validatePassword = (v) =>
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(v)
      ? "Must contain 8+ chars, upper, lower, number & special char"
      : "";

  const validateConfirmPassword = (v) =>
    v !== password ? "Passwords do not match" : "";

  // ---------- HANDLE FIELD INPUT ----------
  const handleField = (field, value, validator) => {
    // only digits in phone while typing
    if (field === "phone" && !/^\d*$/.test(value)) return;

    const setters = {
      username: setUsername,
      name: setName,
      phone: setPhone,
      email: setEmail,
      password: setPassword,
      confirmPassword: setConfirmPassword,
    };

    setters[field](value);

    setErrors((prev) => ({
      ...prev,
      [field]: validator(value),
    }));
  };

  const markTouched = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  // ---------- FOCUS FIRST FIELD WHEN REGISTER OPENS ----------
  useEffect(() => {
    if (isRegister && nameRef.current) nameRef.current.focus();
  }, [isRegister]);

  // ---------- ENTER KEY → NEXT INVALID FIELD ----------
  const handleEnterKey = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    for (let field of fieldOrder) {
      const values = {
        name,
        phone,
        email,
        username,
        password,
        confirmPassword,
      };

      const error = errors[field];
      if (!values[field] || error) {
        setTouched((prev) => ({ ...prev, [field]: true }));

        const el = document.getElementById(field);
        if (el) {
          el.classList.remove("shake");
          void el.offsetWidth;
          el.classList.add("shake");
          el.focus();
        }
        return;
      }
    }
  };

  // ---------- REGISTER BUTTON STATE ----------
  const allFilled =
    username && name && phone && email && password && confirmPassword;

  const noErrors =
    !errors.username &&
    !errors.name &&
    !errors.phone &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  const canRegister = allFilled && noErrors;

  // ---------- LOGIN BUTTON STATE ----------
  const canLogin = loginUsername && loginPassword;

  // ---------- TOAST HELPERS ----------
  const successToast = (msg) => {
    // 🔊 Toast sound
    const toastSound = new Audio("/sounds/magic.mp3");
    toastSound.volume = 0.12;
    toastSound.play().catch(() => { });

    Swal.fire({
      icon: "success",
      title: msg,
      toast: true,
      position: "top",
      timer: 2200,
      showConfirmButton: false,
      timerProgressBar: true,

      // 🎨 animated glass gradient
      background: "linear-gradient(135deg, #7c3aed, #ee28ac, #52d9e2)",
      color: "#eef2ff",



      customClass: {
        popup: "login-toast animated-toast"
      }
    });
  };



  const errorToast = (msg) => {
    // 🔊 Error sound
    const errorSound = new Audio("/sounds/error1.mp3");
    errorSound.volume = 0.18;
    errorSound.play().catch(() => { });

    Swal.fire({
      icon: "error",
      title: "Something went wrong",
      text: msg,
      toast: true,
      position: "top",
      timer: 2800,
      showConfirmButton: false,
      timerProgressBar: true,

      // 🎨 modern error gradient
      background: "linear-gradient(135deg, #7f1d1d, #b91c1c, #ef4444)",
      color: "#fee2e2",

      customClass: {
        popup: "error-toast animated-error-toast"
      }
    });
  };


  // ---------- REGISTER SUBMIT ----------
  const handleRegister = async () => {
    if (!canRegister) return;

    try {
      const res = await fetch("https://skill-learn-job.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) return errorToast(data.message || "Registration failed");

      successToast("Account created successfully");

      // reset register fields
      setUsername("");
      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
      setTouched({});

      // switch to login
      setIsRegister(false);
    } catch (err) {
      errorToast("Server connection failed");
    }
  };

  // ---------- LOGIN SUBMIT ----------
  const handleLogin = async () => {
    if (!canLogin) return;

    try {
      const res = await fetch("https://skill-learn-job.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) return errorToast(data.message || "Invalid credentials");

      if (data.user?.id) {
        localStorage.setItem("userId", data.user.id);
        console.log("Saved ID =", data.user.id);
      }

      successToast("Login successful");

      setTimeout(() => {
        setShowLoader(true);

        setTimeout(() => {
          navigate("/userpage");   // ⭐ use navigate
        }, 2000);

      }, 1500);

    } catch (err) {
      errorToast("Server connection failed");
    }
  };


  // ---------- UI ----------
  return (
    <div
      className={`login-panel ${isOpen ? "open" : ""} ${isRegister ? "register-mode" : ""
        }`}
      onKeyDown={handleEnterKey}
    >
      <div className="login-header">
        <h4>{isRegister ? "Create Account" : "Login"}</h4>
        <span className="close-btn" onClick={onClose}>
          ✕
        </span>
      </div>

      <div className="login-body">
        {/* REGISTER FIELDS */}
        {isRegister && (
          <>
            <input
              id="name"
              ref={nameRef}
              type="text"
              placeholder="Full Name"
              value={name}
              className={
                touched.name
                  ? errors.name
                    ? "invalid-input"
                    : "valid-input"
                  : ""
              }
              onChange={(e) =>
                handleField("name", e.target.value, validateName)
              }
              onBlur={() => markTouched("name")}
            />
            {touched.name && errors.name && (
              <p className="password-error">{errors.name}</p>
            )}

            <input
              id="phone"
              type="tel"
              placeholder="Phone Number"
              maxLength="10"
              value={phone}
              className={
                touched.phone
                  ? errors.phone
                    ? "invalid-input"
                    : "valid-input"
                  : ""
              }
              onChange={(e) =>
                handleField("phone", e.target.value, validatePhone)
              }
              onBlur={() => markTouched("phone")}
            />
            {touched.phone && errors.phone && (
              <p className="password-error">{errors.phone}</p>
            )}

            <input
              id="email"
              type="email"
              placeholder="Email (example@gmail.com)"
              value={email}
              className={
                touched.email
                  ? errors.email
                    ? "invalid-input"
                    : "valid-input"
                  : ""
              }
              onChange={(e) =>
                handleField("email", e.target.value, validateEmail)
              }
              onBlur={() => markTouched("email")}
            />
            {touched.email && errors.email && (
              <p className="password-error">{errors.email}</p>
            )}

            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              className={
                touched.username
                  ? errors.username
                    ? "invalid-input"
                    : "valid-input"
                  : ""
              }
              onChange={(e) =>
                handleField("username", e.target.value, validateUsername)
              }
              onBlur={() => markTouched("username")}
            />
            {touched.username && errors.username && (
              <p className="password-error">{errors.username}</p>
            )}
          </>
        )}

        {/* LOGIN FIELDS */}
        {!isRegister && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <span
                className="password-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </>
        )}

        {/* REGISTER PASSWORD */}
        {isRegister && (
          <>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                className={
                  touched.password
                    ? errors.password
                      ? "invalid-input"
                      : "valid-input"
                    : ""
                }
                onChange={(e) =>
                  handleField("password", e.target.value, validatePassword)
                }
                onBlur={() => markTouched("password")}
              />
              <span
                className="password-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {touched.password && errors.password && (
              <p className="password-error">{errors.password}</p>
            )}

            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter Password"
                value={confirmPassword}
                className={
                  touched.confirmPassword
                    ? errors.confirmPassword
                      ? "invalid-input"
                      : "valid-input"
                    : ""
                }
                onChange={(e) =>
                  handleField(
                    "confirmPassword",
                    e.target.value,
                    validateConfirmPassword
                  )
                }
                onBlur={() => markTouched("confirmPassword")}
              />
              <span
                className="password-eye"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="password-error">{errors.confirmPassword}</p>
            )}
          </>
        )}

        {/* BUTTONS */}
        {!isRegister ? (
          <button
            className="login-btn"
            disabled={!canLogin}
            onClick={handleLogin}
            style={{
              opacity: canLogin ? 1 : 0.4,
              cursor: canLogin ? "pointer" : "not-allowed",
            }}
          >
            Login
          </button>
        ) : (
          <button
            className="register-btn"
            disabled={!canRegister}
            onClick={handleRegister}
            style={{
              opacity: canRegister ? 1 : 0.4,
              cursor: canRegister ? "pointer" : "not-allowed",
            }}
          >
            Create Account
          </button>
        )}

        {!isRegister && <p className="forgot">Forgot Password?</p>}

        <div className="switch-auth">
          {isRegister ? (
            <>
              Already have an account?
              <span onClick={() => setIsRegister(false)}> Login</span>
            </>
          ) : (
            <>
              You don’t have an account?
              <span onClick={() => setIsRegister(true)}> New Account</span>
            </>
          )}
        </div>
      </div>
      {showLoader && <Loader />}

    </div>

  );
};

export default LoginPanel;
