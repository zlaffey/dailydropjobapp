type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-center">
      <p className="text-2xl" aria-hidden="true">
        ⚠️
      </p>
      <p className="mt-2 text-sm text-red-100">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
