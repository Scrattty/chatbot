import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Sparkles, Heart, Shield, MessageCircle, Check } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    gender: '',
    birthdate: '',
    password: '',
    confirmPassword: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.gender || formData.gender === 'select') {
      setError('Please select a gender');
      return;
    }
  
    const birthDate = new Date(formData.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    const isOver18 = age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
  
    if (!isOver18) {
      setError('You must be at least 18 years old to sign up');
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    const users = JSON.parse(localStorage.getItem('users') || '[]');
  
    if (users.some((user: any) => user.email === formData.email)) {
      setError('Email already exists');
      return;
    }
  
    users.push({
      fullname: formData.fullname,
      email: formData.email,
      gender: formData.gender,
      birthdate: formData.birthdate,
      password: formData.password
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    setShowSuccess(true);
    
    setTimeout(() => {
      navigate('/signin');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F4FB] to-[#FFFFFF] flex items-center justify-center p-4">
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created Successfully</h2>
              <p className="text-gray-600 mb-6">Redirecting...</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex w-full max-w-4xl shadow-2xl rounded-3xl overflow-hidden bg-white">
        <div className="bg-gradient-to-br from-[#7CC5E3] to-[#5BA8C9] w-1/2 p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white"></div>
          </div>
          <div className="relative z-10">
  <div className="flex items-center gap-2 mb-8">
    <Sparkles className="w-6 h-6 text-white" />
    <h1 className="text-4xl font-bold text-white">SAM1</h1>
  </div>
  <p className="text-white/90 text-lg mb-12 leading-relaxed">
    Begin your journey to better mental health. Join our community of individuals committed to personal growth and wellness.
  </p>
  <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border border-white/20">
    <Brain className="w-16 h-16 text-white" />
  </div>
  
  {/* Feature Cards Section */}
  <div className="grid grid-cols-2 gap-4 mt-8 relative z-10">
    <div className="bg-sky-300/20 p-4 rounded-lg">
      <Sparkles className="w-8 h-8 mb-2" />
      <h3 className="font-semibold mb-1">AI-Powered Support</h3>
      <p className="text-sm opacity-90">24/7 personalized care and guidance tailored to your needs</p>
    </div>
    <div className="bg-sky-300/20 p-4 rounded-lg">
      <Heart className="w-8 h-8 mb-2" />
      <h3 className="font-semibold mb-1">Mood Tracking</h3>
      <p className="text-sm opacity-90">Monitor and understand your emotional well-being over time</p>
    </div>
    <div className="bg-sky-300/20 p-4 rounded-lg">
      <Shield className="w-8 h-8 mb-2" />
      <h3 className="font-semibold mb-1">Private & Secure</h3>
      <p className="text-sm opacity-90">Your data is protected and stored securely</p>
    </div>
    <div className="bg-sky-300/20 p-4 rounded-lg">
      <MessageCircle className="w-8 h-8 mb-2" />
      <h3 className="font-semibold mb-1">Personalized Chat</h3>
      <p className="text-sm opacity-90">Natural conversations that adapt to your unique situation</p>
    </div>
  </div> {/* This was missing its closing div tag */}
</div> {/* This was the closing div for the "relative z-10" section */}

        </div>
        <div className="w-1/2 p-12">
          <h2 className="text-2xl font-bold mb-4">Start Your Wellness Journey</h2>
          <p className="text-gray-600 mb-8">Create an account to access personalized mental health support</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fullname</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7CC5E3] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7CC5E3] focus:border-transparent ${
                  error.includes('Email') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#7CC5E3] focus:border-transparent"
                >
                  <option value="select">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7CC5E3] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7CC5E3] focus:border-transparent ${
                  error.includes('Passwords') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7CC5E3] focus:border-transparent ${
                  error.includes('Passwords') ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <div className="text-xs text-gray-600 space-y-2">
              <p>By signing up, you agree that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>This is not a substitute for professional mental health treatment</li>
                <li>In case of emergency, please contact a healthcare provider or emergency services</li>
                <li>Your data will be stored locally on your device</li>
              </ul>
            </div>
            <button
              type="submit"
              className="w-full bg-[#7CC5E3] text-white py-2 rounded-lg hover:bg-[#6BB4D2] transition-colors"
            >
              Create Account
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-[#7CC5E3] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
