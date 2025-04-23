import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Wifi, Clock } from 'lucide-react';
import api from '../services/api';

interface ConnectionDetails {
  username: string;
  password: string;
  expiresAt: string;
  packageName: string;
  duration: string;
}

const PaymentSuccess: React.FC = () => {
  const [connectionDetails, setConnectionDetails] = useState<ConnectionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnectionDetails = async () => {
      try {
        const checkoutRequestId = localStorage.getItem('checkoutRequestId');
        
        if (!checkoutRequestId) {
          navigate('/');
          return;
        }
        
        const response = await api.get(`/connections/details/${checkoutRequestId}`);
        
        if (response.data.success) {
          setConnectionDetails(response.data.connection);
        } else {
          setError('Failed to retrieve connection details');
        }
      } catch (error) {
        setError('An error occurred. Please contact support.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConnectionDetails();
  }, [navigate]);
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleReturnHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            You're Connected!
          </h2>
          
          <p className="text-gray-600">
            Your payment has been confirmed and your internet access is now active.
          </p>
        </div>
        
        {connectionDetails ? (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Wifi size={20} className="mr-2 text-primary" />
              Connection Details
            </h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Package</p>
                <p className="font-medium text-gray-900">{connectionDetails.packageName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium text-gray-900">{connectionDetails.duration}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium text-gray-900">{connectionDetails.username}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Password</p>
                <p className="font-medium text-gray-900">{connectionDetails.password}</p>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-500 flex items-center">
                  <Clock size={16} className="mr-1" />
                  Expires at
                </p>
                <p className="font-medium text-gray-900">
                  {formatDate(connectionDetails.expiresAt)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-red-500 mb-6 text-center">
            {error || 'Connection details not available'}
          </div>
        )}
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-700">
            <strong>Note:</strong> Your device should be automatically connected to the internet. 
            If not, please try refreshing the page or reconnecting to the WiFi network.
          </p>
        </div>
        
        <button
          onClick={handleReturnHome}
          className="w-full py-3 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;