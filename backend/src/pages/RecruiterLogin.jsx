import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Recruiter.css";
import Loader from "../Recruiter_component/Loader";

/* ================= COMPANY MASTER ================= */
const COMPANY_CODES = {
  tcs: "tcs-12345678",
  microsoft: "ms-87654321",
  infosys: "info-11223344",
  wipro: "wipro-55667788",
  google: "google-99887766",
  amazon: "amazon-44556677"
};

const RecruiterLogin = () => {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [companyStatus, setCompanyStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    companyName: "",
    companyCode: "",
    username: "",
    password: ""
  });

  /* ================= SOUND ================= */
  const playSound = (type) => {
    const audio = new Audio(
      type === "success"
        ? "/sounds/magic.mp3"
        : "/sounds/error1.mp3"
    );
    audio.play();
  };

  /* ================= DARK ALERT ================= */
  const showAlert = (icon, title, text = "") => {
    playSound(icon === "success" ? "success" : "error");

    return Swal.fire({
      icon,
      title,
      text,
      background: "#121212",
      color: "#ffffff",
      confirmButtonColor: "#22c55e",
      timer: icon === "success" ? 2000 : undefined,
      showConfirmButton: icon !== "success",
      backdrop: "rgba(0,0,0,0.8)",
      customClass: {
        popup: "dark-swal"
      }
    });
  };

  /* ================= LOGIN ================= */
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/recruiter/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("recruiter", JSON.stringify(data.recruiter));

        await showAlert("success", "Login Successful", "Redirecting...");

        setLoading(true);

        setTimeout(() => {
          navigate("/recruiter/dashboard");
        }, 2000);
      } else {
        showAlert("error", "Invalid email or password");
      }
    } catch {
      showAlert("error", "Server error", "Try again later");
    }
  };

  /* ================= REGISTER ================= */
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    if (["companyName", "companyCode"].includes(e.target.name)) {
      setCompanyStatus(null);
    }
  };

  const verifyCompanyCode = () => {
    const key = registerData.companyName.trim().toLowerCase();
    const expected = COMPANY_CODES[key];

    if (!expected) return setCompanyStatus("unknown");
    setCompanyStatus(registerData.companyCode === expected ? "verified" : "error");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(registerData).some(v => !v))
      return showAlert("error", "All fields required");

    if (!/^\d{10}$/.test(registerData.phone))
      return showAlert("error", "Invalid phone number");

    if (companyStatus !== "verified")
      return showAlert("error", "Company verification failed");

    try {
      const res = await fetch("http://localhost:5000/recruiter/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData)
      });

      const data = await res.json();

      if (data.success) {
        await showAlert("success", "Registration Successful", "Please login");
        setIsRegister(false);
      } else {
        showAlert("error", data.message || "Registration failed");
      }
    } catch {
      showAlert("error", "Server error");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="recruiter-page">

      {loading && <Loader message="Redirecting to dashboard..." />}

      {!isRegister && !loading && (
        <div className="login-card">
          <h2>Recruiter Login</h2>

          <form onSubmit={handleLoginSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleLoginChange}
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleLoginChange}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit">Login</button>

            <p className="switch-text">
              New Recruiter?
              <span onClick={() => setIsRegister(true)}> Register</span>
            </p>
          </form>
        </div>
      )}

      {isRegister && !loading && (
        <div className="register-card">
          <h2>Recruiter Registration</h2>

          <form onSubmit={handleRegisterSubmit} className="register-grid">
            <input name="firstName" placeholder="First Name" onChange={handleRegisterChange}/>
            <input name="lastName" placeholder="Last Name" onChange={handleRegisterChange}/>
            <input name="phone" placeholder="Phone Number" maxLength="10" onChange={handleRegisterChange}/>
            <input type="email" name="email" placeholder="Email" onChange={handleRegisterChange}/>
            <input name="companyName" placeholder="Company Name" onChange={handleRegisterChange}/>
            <input name="companyCode" placeholder="Company Code" onChange={handleRegisterChange} onBlur={verifyCompanyCode}/>
            <input name="username" placeholder="Username" onChange={handleRegisterChange}/>

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleRegisterChange}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" className="full-width">Register</button>
          </form>

          <p className="switch-text center">
            Already registered?
            <span onClick={() => setIsRegister(false)}> Login</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default RecruiterLogin;
