import React from 'react';
import { Clock, Wifi } from 'lucide-react';

interface PackageProps {
  id: number;
  name: string;
  duration: string;
  price: number;
  description: string;
  selected: boolean;
  onSelect: (id: number) => void;
}

const PackageCard: React.FC<PackageProps> = ({ 
  id, 
  name, 
  duration, 
  price, 
  description, 
  selected, 
  onSelect 
}) => {
  return (
    <div 
      className={`
        border rounded-lg p-6 transition-all duration-300 cursor-pointer
        ${selected 
          ? 'border-primary bg-primary/5 shadow-md' 
          : 'border-gray-200 hover:border-primary/50 hover:shadow-sm'
        }
      `}
      onClick={() => onSelect(id)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <div className="flex items-center mt-1 text-gray-600">
            <Clock size={16} className="mr-1" />
            <span>{duration}</span>
          </div>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Wifi size={20} className="text-primary" />
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      
      <div className="flex justify-between items-center">
        <div className="text-primary font-bold text-xl">
          KSh {price}
        </div>
        <div 
          className={`
            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
            ${selected 
              ? 'border-primary bg-primary' 
              : 'border-gray-300'
            }
          `}
        >
          {selected && (
            <span className="text-white text-xs">✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageCard;