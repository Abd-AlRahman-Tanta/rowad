// resources/assets/js/components/LoadingSpinner.tsx

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50000000000000000000 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="
          w-12 h-12
          border-4
          border-arch-light
          border-t-transparent
          rounded-full
          animate-spin
          shadow-2xl
        "
      />
    </div>
  );
}