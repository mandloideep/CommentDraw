import { Upload, Pencil, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useProfileLogic } from "./hooks/useProfileLogic";

function FieldInput({ value, onChange, disabled, maxLength = 50 }) {
  return (
    <input
      type="text"
      value={value}
      disabled={disabled}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-transparent border-0 border-b-2 px-0 py-2 text-base focus:outline-none transition-colors ${
        disabled
          ? "border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] text-mute"
          : "border-ink dark:border-paper text-ink dark:text-paper focus:border-[var(--color-punch)]"
      }`}
    />
  );
}

function ProfileSection({ dashboardData, refetchDashboard, setModal }) {
  const fileInputRef = useRef();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [editSnapshot, setEditSnapshot] = useState({ firstName: "", lastName: "" });
  const [inputErrors, setInputErrors] = useState({ firstName: "", lastName: "" });

  const { handleFileChange, handleUpdateName, isChangingName } = useProfileLogic(
    setModal,
    setAvatarUploading,
    refetchDashboard,
    firstName,
    lastName,
    setIsEditing
  );

  useEffect(() => {
    if (dashboardData?.user) {
      setFirstName(dashboardData.user.firstName);
      setLastName(dashboardData.user.lastName);
    }
  }, [dashboardData]);

  const validateName = (name, field) => {
    if (name.trim().length === 0) return `${field} cannot be empty`;
    if (name.trim().length < 2) return `${field} must be at least 2 characters`;
    return "";
  };

  const handleFirstNameChange = (val) => {
    setFirstName(val);
    if (isEditing) {
      setInputErrors((p) => ({ ...p, firstName: validateName(val, "First name") }));
    }
  };
  const handleLastNameChange = (val) => {
    setLastName(val);
    if (isEditing) {
      setInputErrors((p) => ({ ...p, lastName: validateName(val, "Last name") }));
    }
  };

  const disabled =
    !isEditing ||
    firstName.trim().length < 2 ||
    lastName.trim().length < 2 ||
    (firstName === editSnapshot.firstName && lastName === editSnapshot.lastName);

  return (
    <section className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          <span className="text-[var(--color-punch)]">01</span> / Profile
        </p>
        <User size={16} className="text-mute" strokeWidth={1.75} />
      </div>

      <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] mb-2">
        Personal information
      </h2>
      <p className="text-sm text-mute mb-8">
        Update your name and profile picture.
      </p>

      <div className="flex items-center gap-5 mb-8">
        {dashboardData?.user?.avatarUrl ? (
          <img
            src={dashboardData.user.avatarUrl}
            alt=""
            className="h-16 w-16 object-cover border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)]"
          />
        ) : (
          <div className="h-16 w-16 grid place-items-center border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] font-display text-2xl">
            {(firstName || "?").charAt(0).toUpperCase()}
          </div>
        )}
        <button
          onClick={() => fileInputRef.current.click()}
          className="h-10 px-4 inline-flex items-center gap-2 border-2 border-ink dark:border-paper font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors cursor-pointer"
        >
          <Upload size={14} />
          {avatarUploading ? "Uploading..." : "Change picture"}
        </button>
        <input
          type="file"
          accept="image/png, image/jpeg, image/webp"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between">
            <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
              First name
            </label>
            <button
              type="button"
              onClick={() => {
                setEditSnapshot({ firstName, lastName });
                setIsEditing(true);
              }}
              className="text-mute hover:text-[var(--color-punch)]"
              aria-label="Edit name"
            >
              <Pencil size={12} />
            </button>
          </div>
          <FieldInput
            value={firstName}
            onChange={handleFirstNameChange}
            disabled={!isEditing}
          />
          {isEditing && inputErrors.firstName && (
            <p className="text-xs text-[var(--color-punch)] mt-1 font-mono">
              {inputErrors.firstName}
            </p>
          )}
          {isEditing && !inputErrors.firstName && (
            <p className="text-xs text-mute mt-1 font-mono">{firstName.length}/50</p>
          )}
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Last name
          </label>
          <FieldInput
            value={lastName}
            onChange={handleLastNameChange}
            disabled={!isEditing}
          />
          {isEditing && inputErrors.lastName && (
            <p className="text-xs text-[var(--color-punch)] mt-1 font-mono">
              {inputErrors.lastName}
            </p>
          )}
          {isEditing && !inputErrors.lastName && (
            <p className="text-xs text-mute mt-1 font-mono">{lastName.length}/50</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
            Email
          </label>
          <FieldInput
            value={dashboardData?.user?.email || ""}
            onChange={() => {}}
            disabled
          />
          <p className="text-xs text-mute mt-1">Email cannot be changed.</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setFirstName(editSnapshot.firstName);
              setLastName(editSnapshot.lastName);
              setIsEditing(false);
            }}
            className="h-10 px-5 border-2 border-ink dark:border-paper bg-transparent font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-ink hover:text-paper dark:hover:bg-paper dark:hover:text-ink transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          disabled={disabled}
          onClick={handleUpdateName}
          className="h-10 px-5 border-2 border-ink dark:border-paper bg-ink text-paper dark:bg-paper dark:text-ink font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-[var(--color-punch)] hover:border-[var(--color-punch)] hover:text-paper disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isChangingName ? "Saving..." : "Save changes"}
        </button>
      </div>
    </section>
  );
}

export default ProfileSection;
