interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
      <div className="text-red-600 dark:text-red-400 mb-2">
        <span className="text-2xl">⚠️</span>
      </div>
      <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Something went wrong</h3>
      <p className="text-red-700 dark:text-red-300 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}