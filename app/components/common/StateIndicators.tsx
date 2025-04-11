import React from "react";

// --- Loading Spinner Component ---
export const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-[200px]">
    <div className="relative h-12 w-12">
      {/* Use appropriate gray for dark/light mode or pass via props */}
      <div className="absolute h-12 w-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
      <div className="absolute h-12 w-12 rounded-full border-4 border-blue-500 dark:border-blue-400 border-t-transparent animate-spin"></div>
    </div>
  </div>
);

// --- Error Message Component ---
interface ErrorMessageProps {
  message: string;
  title?: string;
}
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message,
  title = "Error Loading Data" // Default title
}) => (
  <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-6 text-center">
    <div className="text-red-500 dark:text-red-400 text-lg font-medium mb-2">
      {title}
    </div>
    <p className="text-sm text-red-600 dark:text-red-300">{message}</p>
  </div>
);

// --- Empty State Component ---
interface EmptyPostsStateProps {
  title?: string;
  message?: string;
}
export const EmptyPostsState: React.FC<EmptyPostsStateProps> = ({ 
  title = "No Posts Found", // Default title
  message = "There are no posts to display here yet." // Default message
}) => (
  <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-8 text-center">
    {/* Consider making the icon a prop if needed */}
    <div className="text-gray-400 dark:text-gray-500 text-5xl mb-4">📭</div> 
    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {title}
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      {message}
    </p>
  </div>
); 