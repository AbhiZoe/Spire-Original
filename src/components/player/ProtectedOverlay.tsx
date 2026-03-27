"use client";

interface ProtectedOverlayProps {
  userEmail?: string;
}

export default function ProtectedOverlay({ userEmail }: ProtectedOverlayProps) {
  return (
    <div
      className="absolute inset-0 z-20"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        pointerEvents: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Transparent capture-blocking layer */}
      <div className="absolute inset-0" />

      {/* Watermark */}
      {userEmail && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="rotate-[-30deg] opacity-[0.07] text-white text-2xl font-bold whitespace-nowrap select-none">
            <div className="flex flex-col gap-24">
              {Array.from({ length: 5 }).map((_, row) => (
                <div key={row} className="flex gap-16">
                  {Array.from({ length: 4 }).map((_, col) => (
                    <span key={col}>{userEmail}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
