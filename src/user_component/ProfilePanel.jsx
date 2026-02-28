import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { FaCamera, FaTimes, FaEdit } from "react-icons/fa";
import "../styles/user.css";
import bg5 from "../assets/bg5.png";

const emitProfileUpdate = () => {
  window.dispatchEvent(new Event("profile-updated"));
};

const ALL_ROLES = [
  "Administrator","Android Developer","AI Engineer","Application Support",
  "Automation Tester","Backend Developer","Business Analyst","Cloud Engineer",
  "Content Writer","Data Analyst","Data Engineer","Database Administrator",
  "DevOps Engineer","Frontend Developer","Fullstack Developer","HR",
  "Intern","Java Developer","Project Manager"
];

const ProfileCreation = ({ onClose }) => {

  const panelRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    user_id: "",
    name: "",
    phone: "",
    email: "",
    father_name: "",
    gender: "",
    dob: "",
    education: [],
    skills: [],
    role: [],
    roleInput: "",
    previewImage: null
  });

  const [filteredRoles, setFilteredRoles] = useState([]);

  /* =======================================================
     ✅ FETCH USER (users + profile merge)
  ======================================================= */
  const fetchUser = async () => {

    const userId = localStorage.getItem("user_id");

    if (!userId) {
      Swal.fire("Error", "User ID missing. Please login again.", "error");
      return;
    }

    try {

      const userRes = await fetch(
        `https://skill-learn-job.onrender.com/get-user/${userId}`
      );
      const userData = await userRes.json();

      const profileRes = await fetch(
        `https://skill-learn-job.onrender.com/get-profile/${userId}`
      );
      const profileData = await profileRes.json();

      setForm(prev => ({
        ...prev,
        user_id: userId,
        name: userData.name || "",
        phone: userData.phone || "",
        email: userData.email || "",
        father_name: profileData.father_name || "",
        gender: profileData.gender || "",
        dob: profileData.dob || "",
        education: profileData.education || [],
        skills: profileData.skills || [],
        role: profileData.role || [],
        previewImage: profileData.image_path || null
      }));

      setSaved(!!profileData.saved);
      setEditMode(false);

    } catch {
      Swal.fire("Error", "Server connection failed", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /* ---------------- INPUT CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* ---------------- CHIP HELPERS ---------------- */
  const addChip = (field, value) => {
    if (!value.trim() || !editMode) return;

    setForm(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }));
  };

  const removeChip = (field, value) => {
    if (!editMode) return;

    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter(v => v !== value)
    }));
  };

  /* ---------------- ROLE TYPEAHEAD ---------------- */
  const handleRoleInput = (e) => {
    if (!editMode) return;

    const val = e.target.value;
    setForm(prev => ({ ...prev, roleInput: val }));

    if (!val) return setFilteredRoles([]);

    setFilteredRoles(
      ALL_ROLES.filter(
        r => r.toLowerCase().includes(val.toLowerCase()) &&
        !form.role.includes(r)
      )
    );
  };

  const selectRole = (role) => {
    if (!editMode) return;

    setForm(prev => ({
      ...prev,
      role: [...prev.role, role],
      roleInput: ""
    }));

    setFilteredRoles([]);
  };

const handleFile = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    setForm(prev => ({
      ...prev,
      previewImage: reader.result
    }));
  };
  reader.readAsDataURL(file);
};


  /* =======================================================
     ✅ FIXED SAVE (ONLY JSON SAFE DATA)
  ======================================================= */
  const handleSubmit = async () => {

    if (saving) return;

    setSaving(true);

    try {

      const payload = {
        user_id: form.user_id,
        name: form.name,
        phone: form.phone,
        email: form.email,
        father_name: form.father_name,
        gender: form.gender,
        dob: form.dob,
        education: form.education,
        skills: form.skills,
        role: form.role,
        image_path: form.previewImage || ""
      };

      const res = await fetch(
        `https://skill-learn-job.onrender.com/save-profile/${form.user_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire({
        icon: "success",
        title: "Profile Saved",
        timer: 1200,
        showConfirmButton: false
      });

      await fetchUser();
      emitProfileUpdate();
      setTimeout(onClose, 600);

    } catch {
      Swal.fire("Error", "Profile not saved", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleEdit = () => {
    if (!saved) return setEditMode(true);
    setEditMode(prev => !prev);
  };

  if (loading) return <p>Loading profile…</p>;

  /* ================= UI UNCHANGED ================= */

  return (
    <div className="profile-overlay">
      <div className="profile-panel" ref={panelRef}>
        {/* HEADER */}
        <div className="panel-header">
          <h3>Profile Creation</h3>
          <div className="header-buttons">
            <button className="edit-btn" onClick={toggleEdit}>
              <FaEdit /> {editMode ? "Editing" : "Edit"}
            </button>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        {/* IMAGE */}
        <div className="profile-image-container">
          <img src={form.previewImage || bg5} alt="Profile" className="profile-image" />
          {editMode && (
            <label className="camera-icon">
              <FaCamera />
              <input type="file" name="image_path" accept="image/*" onChange={handleFile} />
            </label>
          )}
        </div>

        {/* AUTO FILL */}
        <div className="row">
          <div className="field-block"><input type="text" value={form.name} readOnly /></div>
          <div className="field-block"><input type="text" value={form.phone} readOnly /></div>
          <div className="field-block"><input type="email" value={form.email} readOnly /></div>
          <div className="field-block">
            <input type="text" name="father_name" value={form.father_name}
              onChange={handleChange} disabled={!editMode} placeholder="Father Name" />
          </div>
        </div>

        {/* GENDER */}
        <label className="gender-label">Gender</label>
        <div className="gender-group">
          {["Male", "Female", "Other"].map(g => (
            <label key={g}>
              <input type="radio" name="gender" value={g}
                checked={form.gender === g}
                disabled={!editMode}
                onChange={handleChange} /> {g}
            </label>
          ))}
        </div>

        {/* DOB */}
        <div className="field-block">
          <input type="date" name="dob" value={form.dob}
            disabled={!editMode} onChange={handleChange} />
        </div>

        {/* EDUCATION */}
        <div className="field-block chips-input">
          <input type="text" placeholder="Education" disabled={!editMode}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addChip("education", e.target.value);
                e.target.value = "";
              }
            }} />
          <div className="chips">
            {form.education.map(ed => (
              <span key={ed} className="chip">
                {ed}
                {editMode && <button onClick={() => removeChip("education", ed)}>x</button>}
              </span>
            ))}
          </div>
        </div>

        {/* SKILLS */}
        <div className="field-block chips-input">
          <input type="text" placeholder="Skills" disabled={!editMode}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addChip("skills", e.target.value);
                e.target.value = "";
              }
            }} />
          <div className="chips">
            {form.skills.map(sk => (
              <span key={sk} className="chip">
                {sk}
                {editMode && <button onClick={() => removeChip("skills", sk)}>x</button>}
              </span>
            ))}
          </div>
        </div>

        {/* CERTIFICATES */}
        <div className="field-block">
          <label>Upload Certificates (PDF)</label>
          <input type="file" name="certificates" accept=".pdf" multiple
            disabled={!editMode} onChange={handleFile} />
        </div>

        {/* ROLE */}
        <div className="field-block chips-input">
          <input type="text" placeholder="Role" disabled={!editMode}
            value={form.roleInput} onChange={handleRoleInput} />
          <div className="chips">
            {form.role.map(r => (
              <span key={r} className="chip">
                {r}
                {editMode && <button onClick={() => removeChip("role", r)}>x</button>}
              </span>
            ))}
          </div>

          {filteredRoles.length > 0 && editMode && (
            <ul className="role-dropdown">
              {filteredRoles.map(r => (
                <li key={r} onClick={() => selectRole(r)}>{r}</li>
              ))}
            </ul>
          )}
        </div>

        {/* SAVE */}
        {editMode && (
          <button className="save-btn" onClick={handleSubmit} disabled={saving}>
            {saving ? <span className="spinner" /> : "Save Profile"}
          </button>
        )}
      </div>
    </div>


  );
};

export default ProfileCreation;