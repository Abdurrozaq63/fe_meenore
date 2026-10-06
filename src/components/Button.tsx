interface ButtonProps {
  title: string
  action: () => void
  type?: "create" | "edit" | "delete" | "cancel" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

export default function Button({
  title,
  action,
  type = "create",
  size = "md",
  disabled = false,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-mono font-medium tracking-tight transition-all duration-150 border cursor-pointer select-none"

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded",
    md: "px-4 py-2 text-sm rounded",
    lg: "px-6 py-3 text-sm rounded",
  }

  const variants = {
    create:
      "bg-blue-600 border-blue-500 text-white hover:bg-blue-500 active:bg-blue-700 shadow-sm shadow-blue-900/30",
    edit: "bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20 active:bg-amber-500/5",
    delete:
      "bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20 active:bg-red-500/5",
    cancel:
      "bg-transparent border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--muted-foreground)]",
    ghost:
      "bg-transparent border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]",
  }

  const disabledStyle = "opacity-40 cursor-not-allowed pointer-events-none"

  return (
    <button
      onClick={disabled ? undefined : action}
      className={`${base} ${sizes[size]} ${variants[type]} ${disabled ? disabledStyle : ""} ${fullWidth ? "w-full" : ""}`}
      disabled={disabled}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {title}
    </button>
  )
}
