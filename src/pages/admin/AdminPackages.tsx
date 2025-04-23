import React, { useState, useEffect } from 'react';
import { RefreshCw, PlusCircle, Edit, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  minutes: number;
  active: boolean;
  createdAt: string;
}

const AdminPackages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<Package>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newPackage, setNewPackage] = useState<Partial<Package>>({
    name: '',
    description: '',
    price: 0,
    minutes: 0,
    active: true
  });
  
  useEffect(() => {
    fetchPackages();
  }, []);
  
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/packages');
      setPackages(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load packages data');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else if (minutes < 1440) {
      return `${minutes / 60} hour(s)`;
    } else if (minutes < 10080) {
      return `${minutes / 1440} day(s)`;
    } else {
      return `${minutes / 10080} week(s)`;
    }
  };
  
  const handleRefresh = () => {
    fetchPackages();
    setIsEditing(false);
    setIsAdding(false);
  };
  
  const handleEdit = (pkg: Package) => {
    setEditingPackage({ ...pkg });
    setIsEditing(true);
    setIsAdding(false);
  };
  
  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setNewPackage({
      name: '',
      description: '',
      price: 0,
      minutes: 0,
      active: true
    });
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setEditingPackage({
        ...editingPackage,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name === 'price' || name === 'minutes') {
      setEditingPackage({
        ...editingPackage,
        [name]: parseFloat(value) || 0
      });
    } else {
      setEditingPackage({
        ...editingPackage,
        [name]: value
      });
    }
  };
  
  const handleNewPackageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setNewPackage({
        ...newPackage,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name === 'price' || name === 'minutes') {
      setNewPackage({
        ...newPackage,
        [name]: parseFloat(value) || 0
      });
    } else {
      setNewPackage({
        ...newPackage,
        [name]: value
      });
    }
  };
  
  const saveEditedPackage = async () => {
    try {
      await api.put(`/admin/packages/${editingPackage.id}`, editingPackage);
      fetchPackages();
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update package');
    }
  };
  
  const saveNewPackage = async () => {
    try {
      await api.post('/admin/packages', newPackage);
      fetchPackages();
      setIsAdding(false);
    } catch (err) {
      setError('Failed to add package');
    }
  };

  return (
    <AdminLayout title="Packages Management">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          {isEditing ? 'Edit Package' : isAdding ? 'Add New Package' : 'All Packages'}
        </h2>
        
        <div className="flex space-x-2">
          {!isEditing && !isAdding && (
            <button 
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <PlusCircle size={16} className="mr-2" />
              Add Package
            </button>
          )}
          
          <button 
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {isEditing && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Package Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editingPackage.name || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (KSh)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={editingPackage.price || 0}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                min="0"
                step="10"
                required
              />
            </div>
            
            <div>
              <label htmlFor="minutes" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="minutes"
                name="minutes"
                value={editingPackage.minutes || 0}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                min="1"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {editingPackage.minutes ? `Equals ${formatDuration(editingPackage.minutes)}` : ''}
              </p>
            </div>
            
            <div>
              <label htmlFor="active" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={editingPackage.active}
                  onChange={(e) => setEditingPackage({...editingPackage, active: e.target.checked})}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={editingPackage.description || ''}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                rows={3}
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              onClick={saveEditedPackage}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
      
      {isAdding && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-1">
                Package Name
              </label>
              <input
                type="text"
                id="newName"
                name="name"
                value={newPackage.name}
                onChange={handleNewPackageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            
            <div>
              <label htmlFor="newPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Price (KSh)
              </label>
              <input
                type="number"
                id="newPrice"
                name="price"
                value={newPackage.price}
                onChange={handleNewPackageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                min="0"
                step="10"
                required
              />
            </div>
            
            <div>
              <label htmlFor="newMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="newMinutes"
                name="minutes"
                value={newPackage.minutes}
                onChange={handleNewPackageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                min="1"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {newPackage.minutes ? `Equals ${formatDuration(newPackage.minutes)}` : ''}
              </p>
            </div>
            
            <div>
              <label htmlFor="newActive" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="newActive"
                  name="active"
                  checked={newPackage.active}
                  onChange={(e) => setNewPackage({...newPackage, active: e.target.checked})}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="newActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="newDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="newDescription"
                name="description"
                value={newPackage.description}
                onChange={handleNewPackageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                rows={3}
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel
            </button>
            <button
              onClick={saveNewPackage}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add Package
            </button>
          </div>
        </div>
      )}
      
      {!isEditing && !isAdding && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price (KSh)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {packages.length > 0 ? (
                    packages.map((pkg) => (
                      <tr key={pkg.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 max-w-xs truncate">{pkg.description || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{pkg.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDuration(pkg.minutes)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${pkg.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'}`}
                          >
                            {pkg.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleEdit(pkg)}
                            className="text-primary hover:text-primary/80 flex items-center"
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        No packages found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPackages;