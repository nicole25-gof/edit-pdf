"use client";

interface AppToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function AppToast({ message, onDismiss }: AppToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed bottom-6 left-1/2 z-50 w-[min(36rem,calc(100%-2rem))] -translate-x-1/2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <p>{message}</p>
        <button
          type="button"
          className="shrink-0 text-xs font-medium text-red-700 hover:underline"
          onClick={onDismiss}
        >
          关闭
        </button>
      </div>
    </div>
  );
}
