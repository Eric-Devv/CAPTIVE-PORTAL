import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Clock, CheckCircle2 } from 'lucide-react';
import PackageCard from '../components/PackageCard';
import api from '../services/api';

interface Package {
  id: number;
  name: string;
  duration: string;
  price: number;
  description: string;
  minutes: number;
}

const CaptivePortal: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch packages from the API
    const fetchPackages = async () => {
      try {
        const response = await api.get('/packages');
        setPackages(response.data);
        
        // Select the first package by default
        if (response.data.length > 0) {
          setSelectedPackage(response.data[0].id);
        }
      } catch (error) {
        setError('Failed to load packages. Please try again later.');
      }
    };

    fetchPackages();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit to valid phone number format
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 12) {
      setPhoneNumber(value);
    }
  };

  const validatePhone = () => {
    // Basic validation for Kenya phone numbers
    const phoneRegex = /^(?:254|\+254|0)?(7\d{8})$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone()) {
      setError('Please enter a valid Kenyan phone number');
      return;
    }
    
    if (!selectedPackage) {
      setError('Please select a package');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Format phone number to international format if needed
      let formattedPhone = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        formattedPhone = '254' + phoneNumber.substring(1);
      }
      
      const response = await api.post('/payments/initiate', {
        phoneNumber: formattedPhone,
        packageId: selectedPackage
      });
      
      if (response.data.success) {
        // Store the checkout request ID for callback verification
        localStorage.setItem('checkoutRequestId', response.data.checkoutRequestId);
        localStorage.setItem('phoneNumber', formattedPhone);
        
        // Redirect to payment pending page
        navigate('/payment/pending');
      } else {
        setError(response.data.message || 'Payment initiation failed');
      }
    } catch (error) {
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <Wifi size={28} className="text-primary mr-2" />
            <h1 className="text-xl font-bold text-gray-900">WiFi Hotspot</h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Our WiFi Service</h2>
          <p className="text-gray-600 mb-6">
            Connect to high-speed internet by selecting a package and completing payment via M-Pesa.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white mr-3">
                1
              </div>
              <p className="text-gray-700">Select your preferred package</p>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white mr-3">
                2
              </div>
              <p className="text-gray-700">Enter your M-Pesa phone number</p>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white mr-3">
                3
              </div>
              <p className="text-gray-700">Complete payment via M-Pesa STK Push</p>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white mr-3">
                <CheckCircle2 size={16} />
              </div>
              <p className="text-gray-700">Get connected automatically!</p>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Your Package</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  id={pkg.id}
                  name={pkg.name}
                  duration={pkg.duration}
                  price={pkg.price}
                  description={pkg.description}
                  selected={selectedPackage === pkg.id}
                  onSelect={setSelectedPackage}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                Loading packages...
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Your Phone Number</h3>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                placeholder="e.g., 0712345678"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the phone number registered with M-Pesa
              </p>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || !selectedPackage || !phoneNumber}
            className={`
              w-full py-3 px-4 flex items-center justify-center rounded-md text-white font-medium
              ${loading || !selectedPackage || !phoneNumber 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90 transition-colors'}
            `}
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></span>
                Processing...
              </>
            ) : (
              'Pay with M-Pesa'
            )}
          </button>
        </form>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; 2025 WiFi Captive Portal. All rights reserved.</p>
          <p className="mt-2">Powered by M-Pesa</p>
        </div>
      </footer>
    </div>
  );
};

export default CaptivePortal;