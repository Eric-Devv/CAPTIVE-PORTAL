import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const PaymentPending: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [status, setStatus] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    // Get checkout request ID from localStorage
    const checkoutRequestId = localStorage.getItem('checkoutRequestId');
    
    if (!checkoutRequestId) {
      navigate('/');
      return;
    }
    
    // Start countdown
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Poll for payment status
    const checkStatus = async () => {
      try {
        const response = await api.get(`/payments/status/${checkoutRequestId}`);
        
        if (response.data.status === 'completed') {
          clearInterval(interval);
          clearInterval(statusInterval);
          setStatus('completed');
          
          // Wait a moment before redirecting to success page
          setTimeout(() => {
            navigate('/payment/success');
          }, 1500);
        } else if (response.data.status === 'failed') {
          clearInterval(interval);
          clearInterval(statusInterval);
          setStatus('failed');
          
          // Wait a moment before redirecting to failure page
          setTimeout(() => {
            navigate('/payment/failure');
          }, 1500);
        }
      } catch (error) {
        console.error('Failed to check payment status', error);
      }
    };
    
    // Check status immediately and then every 5 seconds
    checkStatus();
    const statusInterval = setInterval(checkStatus, 5000);
    
    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, [navigate]);
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="mb-6">
          {status === 'pending' && (
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-yellow-100 rounded-full">
              <Clock size={32} className="text-yellow-500" />
            </div>
          )}
          {status === 'completed' && (
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
              <div className="text-green-500 text-2xl">✓</div>
            </div>
          )}
          {status === 'failed' && (
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
              <div className="text-red-500 text-2xl">✕</div>
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {status === 'pending' && 'Waiting for Payment'}
          {status === 'completed' && 'Payment Successful!'}
          {status === 'failed' && 'Payment Failed'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {status === 'pending' && 
            'Please complete the payment request sent to your phone via M-Pesa STK push.'}
          {status === 'completed' && 
            'Your payment has been confirmed. You will be redirected shortly.'}
          {status === 'failed' && 
            'We could not confirm your payment. Please try again.'}
        </p>
        
        {status === 'pending' && secondsLeft > 0 && (
          <div className="mb-6">
            <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg text-2xl font-mono font-bold text-primary">
              {formatTime(secondsLeft)}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Time remaining to complete payment
            </p>
          </div>
        )}
        
        {status === 'pending' && secondsLeft <= 0 && (
          <p className="mb-6 text-red-500">
            Time expired. Please try again.
          </p>
        )}
        
        {status === 'pending' ? (
          <button
            onClick={handleCancel}
            className="flex items-center justify-center mx-auto text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} className="mr-1" />
            Cancel and return
          </button>
        ) : status === 'failed' ? (
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        ) : (
          <div className="animate-pulse text-sm text-gray-500">
            Redirecting you shortly...
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPending;