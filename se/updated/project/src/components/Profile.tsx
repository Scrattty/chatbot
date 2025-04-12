import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

interface UserProfile {
  fullname: string;
  email: string;
  gender: string;
  birthdate: string;
  language: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    fullname: '',
    email: '',
    gender: '',
    birthdate: '',
    language: 'English'
  });
  const [tempValues, setTempValues] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      // Redirect to login if no user is logged in
      navigate('/signin');
      return;
    }

    const userData = JSON.parse(currentUser);
    setProfile({
      fullname: userData.fullname || '',
      email: userData.email || '',
      gender: userData.gender || '',
      birthdate: userData.birthdate || '',
      language: userData.language || 'English'
    });
  }, [navigate]);

  const handleEdit = (field: keyof UserProfile) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
    setTempValues(prev => ({ ...prev, [field]: profile[field] }));
  };

  const handleSave = (field: keyof UserProfile) => {
    if (tempValues[field] !== undefined) {
      const updatedProfile = { ...profile, [field]: tempValues[field] };
      setProfile(updatedProfile);

      // Update user data in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((user: any) => 
        user.email === profile.email ? { ...user, [field]: tempValues[field] } : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('currentUser', JSON.stringify({ ...updatedProfile }));
    }
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  const handleCancel = (field: keyof UserProfile) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
    setTempValues(prev => ({ ...prev, [field]: profile[field] }));
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setTempValues(prev => ({ ...prev, [field]: value }));
  };

  const handleLanguageChange = (language: string) => {
    const updatedProfile = { ...profile, language };
    setProfile(updatedProfile);
    setShowLanguageDropdown(false);

    // Update language in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => 
      user.email === profile.email ? { ...user, language } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(updatedProfile));
  };

  const handleSaveProfile = () => {
    // Update all user data in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) => 
      user.email === profile.email ? { ...user, ...profile } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify(profile));
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <div className="bg-[#7CC5E3] rounded-3xl shadow-lg overflow-hidden p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          </div>
          <div>
            <div className="bg-white px-4 py-2 rounded-lg">
              <span className="text-gray-500">Account ID:</span>
              <span className="ml-2">{profile.email}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-24 text-white">Name</label>
            <input
              type="text"
              value={isEditing.fullname ? tempValues.fullname : profile.fullname}
              onChange={(e) => handleChange('fullname', e.target.value)}
              disabled={!isEditing.fullname}
              placeholder="Enter your name"
              className="flex-1 px-4 py-2 rounded-lg"
            />
            {isEditing.fullname ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleSave('fullname')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
                <button 
                  onClick={() => handleCancel('fullname')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleEdit('fullname')}
                className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg"
              >
                Change
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="w-24 text-white">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="flex-1 px-4 py-2 rounded-lg bg-gray-100"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="w-24 text-white">Gender</label>
            <input
              type="text"
              value={isEditing.gender ? tempValues.gender : profile.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              disabled={!isEditing.gender}
              placeholder="Enter gender"
              className="flex-1 px-4 py-2 rounded-lg"
            />
            {isEditing.gender ? (
              <div className="flex gap-2">
                <button 
                  onClick={() => handleSave('gender')}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
                <button 
                  onClick={() => handleCancel('gender')}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleEdit('gender')}
                className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg"
              >
                Change
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="w-24 text-white">Birthdate</label>
            <input
              type="date"
              value={profile.birthdate}
              onChange={(e) => {
                const updatedProfile = { ...profile, birthdate: e.target.value };
                setProfile(updatedProfile);
                handleSave('birthdate');
              }}
              className="flex-1 px-4 py-2 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-4 relative">
            <label className="w-24 text-white">Language</label>
            <button 
              className="flex-1 bg-white px-4 py-2 rounded-lg flex justify-between items-center"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <span>{profile.language}</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            {showLanguageDropdown && (
              <div className="absolute top-full left-24 right-0 mt-1 bg-white rounded-lg shadow-lg z-10">
                <button 
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => handleLanguageChange('English')}
                >
                  English
                </button>
                <button 
                  className="w-full px-4 py-2 text-left hover:bg-gray-100"
                  onClick={() => handleLanguageChange('Tagalog')}
                >
                  Tagalog
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={handleSaveProfile}
            className="w-full bg-[#7C3AED] text-white py-3 rounded-lg mt-8"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;