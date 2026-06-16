interface AvatarProps {
  displayName: string
  size?: number
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export default function Avatar({ displayName, size = 40 }: AvatarProps) {
  return (
    <div
      className="rounded-full bg-lagoon flex items-center justify-center text-white font-sans font-bold leading-none select-none shrink-0"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials(displayName)}
    </div>
  )
}
