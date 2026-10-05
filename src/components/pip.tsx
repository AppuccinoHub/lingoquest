export function Pip({
  mood = "idle",
  className = "",
}: {
  mood?: "idle" | "cheer" | "think" | "listen"
  className?: string
}) {
  const mouth =
    mood === "cheer"
      ? "M46 78c6 8 22 8 28 0"
      : mood === "listen"
        ? "M52 76h16"
        : mood === "think"
          ? "M50 78c4 2 16 2 20-1"
          : "M48 76c5 6 19 6 24 0"
  const eyeY = mood === "think" ? 48 : 52

  return (
    <svg viewBox="0 0 120 120" className={`pip-bob ${className}`} aria-hidden>
      <ellipse cx="60" cy="108" rx="28" ry="6" fill="#e7d7bc" />
      <path d="M22 62c0-28 16-46 38-46s38 18 38 46-14 48-38 48S22 90 22 62z" fill="#1f6b58" />
      <circle cx="38" cy="70" r="7" fill="#e25b45" opacity="0.9" />
      <circle cx="86" cy="66" r="5" fill="#f0c14a" />
      <circle cx="48" cy={eyeY} r="7" fill="#f7f1e6" />
      <circle cx="74" cy={eyeY} r="7" fill="#f7f1e6" />
      <circle cx={mood === "think" ? 46 : 49} cy={eyeY + 1} r="3" fill="#1c2430" />
      <circle cx={mood === "think" ? 72 : 75} cy={eyeY + 1} r="3" fill="#1c2430" />
      <path d={mouth} fill="none" stroke="#f7f1e6" strokeWidth="3" strokeLinecap="round" />
      <path d="M78 28h22l-4 10h-14l-4-10z" fill="#f0c14a" />
      <path d="M82 28v-8h14" fill="none" stroke="#1c2430" strokeWidth="2" />
    </svg>
  )
}
