import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

const PaymentFailure: React.FC = () => {
  const navigate = useNavigate();
  
  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
          <XCircle size={32} className="text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h2>
        
        <p className="text-gray-600 mb-6">
          We couldn't process your payment. This could be due to insufficient funds, 
          a cancelled transaction, or a technical issue.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">
            <strong>Possible reasons:</strong>
            <ul className="mt-2 list-disc list-inside">
              <li>Insufficient funds in your M-Pesa account</li>
              <li>You cancelled the payment request</li>
              <li>You entered the wrong M-Pesa PIN</li>
              <li>Your session timed out</li>
            </ul>
          </p>
        </div>
        
        <button
          onClick={handleReturnHome}
          className="w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;