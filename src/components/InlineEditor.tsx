import { useState } from "react"

interface InlineEditorProps {
  value: string
  onSave: (value: string) => void
  multiline?: boolean
  placeholder?: string
  className?: string
}

export default function InlineEditor({
  value,
  onSave,
  multiline = false,
  placeholder = "Edit...",
  className = "",
}: InlineEditorProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const handleSave = () => {
    onSave(draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(value)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault()
      handleSave()
    }
    if (e.key === "Escape") handleCancel()
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className={`group text-left w-full rounded px-2 py-1 -mx-2 -my-1 hover:bg-[var(--muted)] transition-colors cursor-text ${className}`}
        title="Click to edit"
      >
        <span className="text-[var(--foreground)]">{value || placeholder}</span>
        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-[var(--muted-foreground)]">
          edit
        </span>
      </button>
    )
  }

  return (
    <div className="w-full">
      {multiline ? (
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          className="w-full px-2 py-1.5 rounded text-sm text-[var(--foreground)] bg-[var(--muted)] border border-[var(--ring)] outline-none resize-none font-[inherit] leading-relaxed"
        />
      ) : (
        <input
          autoFocus
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-2 py-1.5 rounded text-sm text-[var(--foreground)] bg-[var(--muted)] border border-[var(--ring)] outline-none font-[inherit]"
        />
      )}
      <div className="flex gap-1.5 mt-1.5">
        <button
          onClick={handleSave}
          className="px-2 py-1 text-[10px] font-mono font-medium text-blue-400 bg-blue-500/10 border border-blue-500/30 rounded hover:bg-blue-500/20 transition-colors"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="px-2 py-1 text-[10px] font-mono text-[var(--muted-foreground)] bg-transparent border border-[var(--border)] rounded hover:text-[var(--foreground)] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
