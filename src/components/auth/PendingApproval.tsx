import { Link } from 'react-router-dom';
import image from '../../assets/favicon.svg';

const PendingApproval = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700">
        <div className="flex flex-col items-center mb-8">
          <img src={image} alt="Company Logo" className="h-12 w-auto mb-4" loading="lazy" />
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-800">Account Pending Approval</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
            Your manager account is currently pending approval. Please wait for an administrator to review your account.
          </p>
        </div>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-block py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;