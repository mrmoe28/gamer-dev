'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  FaGamepad, 
  FaArrowLeft, 
  FaCamera, 
  FaSave, 
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGlobe,
  FaCode,
  FaPalette,
  FaMusic,
  FaEdit,
  FaUsers
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface ProfileData {
  displayName: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  skills: {
    programming: number;
    art: number;
    audio: number;
  };
  socialLinks: {
    github: string;
    twitter: string;
    linkedin: string;
    portfolio: string;
  };
  lookingForTeam: boolean;
  availabilityStatus: string;
  preferredRoles: string[];
  experience: string;
}

export default function ProfileSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    skills: {
      programming: 4,
      art: 3,
      audio: 2
    },
    socialLinks: {
      github: '',
      twitter: '',
      linkedin: '',
      portfolio: ''
    },
    lookingForTeam: false,
    availabilityStatus: 'available',
    preferredRoles: [],
    experience: 'intermediate'
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  const loadProfileData = useCallback(async () => {
    if (!session?.user?.email) {
      console.log('No email in session, skipping profile load');
      return;
    }

    try {
      console.log('Loading profile data for user:', session.user.email);
      setIsLoadingProfile(true);
      setProfileError('');
      
      const response = await fetch('/api/profile', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Profile API error:', errorData);
        console.error('Response status:', response.status);
        setProfileError(`Failed to load profile: ${errorData.error || 'Unknown error'}`);
        return;
      }
      
      const data = await response.json();
      setProfileData({
        displayName: data.displayName || session.user.name || '',
        email: data.email || session.user.email || '',
        bio: data.bio || '',
        location: data.location || '',
        website: data.website || '',
        skills: data.skills || { programming: 4, art: 3, audio: 2 },
        socialLinks: data.socialLinks || {
          github: '',
          twitter: '',
          linkedin: '',
          portfolio: ''
        },
        lookingForTeam: data.lookingForTeam || false,
        availabilityStatus: data.availabilityStatus || 'available',
        preferredRoles: data.preferredRoles || [],
        experience: data.experience || 'intermediate'
      });
      
      // Set custom image if it exists
      if (data.customImage) {
        setProfileImage(data.customImage);
      }
      
      setHasLoadedProfile(true);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfileError('Failed to load profile. Please try refreshing the page.');
    } finally {
      setIsLoadingProfile(false);
    }
  }, [session]);

  // Load profile data from API
  useEffect(() => {
    console.log('Profile page - Status:', status);
    console.log('Profile page - Session:', session?.user?.email);
    console.log('Profile page - Has loaded:', hasLoadedProfile);
    
    if (status === 'authenticated' && session?.user?.email && !hasLoadedProfile && !isLoadingProfile) {
      loadProfileData();
    }
  }, [status, session, hasLoadedProfile, isLoadingProfile, loadProfileData]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsLoading(true);
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        
        // Upload image using dedicated endpoint
        const response = await fetch('/api/profile/upload-image', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setProfileImage(result.url);
          setSaveMessage('Profile image uploaded successfully!');
          setTimeout(() => setSaveMessage(''), 3000);
        } else {
          const error = await response.json();
          setSaveMessage(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error('Error uploading profile image:', error);
        setSaveMessage('Error uploading profile image. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSaveMessage('');
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profileData,
          preferredRoles: JSON.stringify(profileData.preferredRoles),
        }),
      });

      if (response.ok) {
        setSaveMessage('Profile saved successfully!');
        setIsEditing(false);
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        const error = await response.json();
        setSaveMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage('Error saving profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="gradient-bg flex items-center justify-center">
        <div className="text-white text-xl">Loading session...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/signin');
    return (
      <div className="gradient-bg flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to sign in...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="gradient-bg flex items-center justify-center">
        <div className="text-white text-xl">No session found...</div>
      </div>
    );
  }

  return (
    <div className="gradient-bg">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors">
                <FaArrowLeft />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <FaGamepad className="text-purple-400 text-2xl" />
              <span className="text-white font-bold text-xl">Profile Settings</span>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            saveMessage.includes('Error') 
              ? 'bg-red-600/20 border border-red-500/30 text-red-400' 
              : 'bg-green-600/20 border border-green-500/30 text-green-400'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* Profile Error Message */}
        {profileError && (
          <div className="mb-6 p-4 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400">
            {profileError}
            <button 
              type="button"
              onClick={() => {
                setProfileError('');
                setHasLoadedProfile(false);
                loadProfileData();
              }}
              className="ml-4 text-red-300 hover:text-red-200 underline"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 mx-auto mb-4">
                    {profileImage ? (
                      <Image 
                        src={profileImage} 
                        alt="Profile" 
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : session.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt="Profile" 
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUser className="text-white text-4xl" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors"
                    title="Upload profile image"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <FaCamera />
                    )}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  title="Profile image upload"
                />
                <h2 className="text-white text-xl font-bold mb-2">
                  {profileData.displayName || session.user?.name || 'Developer'}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {session.user?.email}
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors mx-auto"
                >
                  <FaEdit />
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h3 className="text-white text-xl font-bold mb-6">Profile Information</h3>
              
              {isLoadingProfile && !hasLoadedProfile ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-gray-400">
                    <svg className="animate-spin h-8 w-8 text-purple-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p>Loading your profile...</p>
                  </div>
                </div>
              ) : (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Display Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                        placeholder="Enter your display name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                        placeholder="https://your-website.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                    placeholder="Tell us about yourself and your game development experience..."
                  />
                </div>

                {/* Skills Section */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Skills & Expertise</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaCode className="text-purple-400" />
                        <span className="text-white">Programming</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => isEditing && setProfileData({
                              ...profileData, 
                              skills: {...profileData.skills, programming: star}
                            })}
                            disabled={!isEditing}
                            className={`text-lg ${star <= profileData.skills.programming ? 'text-yellow-400' : 'text-gray-600'} ${isEditing ? 'hover:text-yellow-300' : ''} transition-colors`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaPalette className="text-blue-400" />
                        <span className="text-white">Art & Design</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => isEditing && setProfileData({
                              ...profileData, 
                              skills: {...profileData.skills, art: star}
                            })}
                            disabled={!isEditing}
                            className={`text-lg ${star <= profileData.skills.art ? 'text-yellow-400' : 'text-gray-600'} ${isEditing ? 'hover:text-yellow-300' : ''} transition-colors`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaMusic className="text-green-400" />
                        <span className="text-white">Audio</span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => isEditing && setProfileData({
                              ...profileData, 
                              skills: {...profileData.skills, audio: star}
                            })}
                            disabled={!isEditing}
                            className={`text-lg ${star <= profileData.skills.audio ? 'text-yellow-400' : 'text-gray-600'} ${isEditing ? 'hover:text-yellow-300' : ''} transition-colors`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teammate Finding Section */}
                <div>
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <FaUsers className="text-purple-400" />
                    Teammate Preferences
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Looking for Team Toggle */}
                    <div className="flex items-center justify-between">
                      <label className="text-white">Looking for Team</label>
                      <button
                        type="button"
                        onClick={() => isEditing && setProfileData({...profileData, lookingForTeam: !profileData.lookingForTeam})}
                        disabled={!isEditing}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          profileData.lookingForTeam ? 'bg-purple-600' : 'bg-gray-600'
                        } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        aria-label={`${profileData.lookingForTeam ? 'Disable' : 'Enable'} looking for team`}
                        title={`${profileData.lookingForTeam ? 'Disable' : 'Enable'} looking for team`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            profileData.lookingForTeam ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Availability Status */}
                    <div>
                      <label id="availability-status-label" className="block text-gray-400 text-sm font-medium mb-2">
                        Availability Status
                      </label>
                      <select
                        id="availability-status"
                        value={profileData.availabilityStatus}
                        onChange={(e) => setProfileData({...profileData, availabilityStatus: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
                        aria-labelledby="availability-status-label"
                      >
                        <option value="available">Available</option>
                        <option value="busy">Busy</option>
                        <option value="open_to_offers">Open to Offers</option>
                      </select>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label id="experience-level-label" className="block text-gray-400 text-sm font-medium mb-2">
                        Experience Level
                      </label>
                      <select
                        id="experience-level"
                        value={profileData.experience}
                        onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
                        aria-labelledby="experience-level-label"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    {/* Preferred Roles */}
                    <div>
                      <label id="preferred-roles-label" className="block text-gray-400 text-sm font-medium mb-2">
                        Preferred Roles (comma-separated)
                      </label>
                      <input
                        id="preferred-roles"
                        type="text"
                        value={profileData.preferredRoles.join(', ')}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          preferredRoles: e.target.value.split(',').map(role => role.trim()).filter(role => role)
                        })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                        placeholder="e.g., Game Developer, Unity Programmer, Level Designer"
                        aria-labelledby="preferred-roles-label"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-white font-semibold mb-4">Social Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="url"
                      value={profileData.socialLinks.github}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        socialLinks: {...profileData.socialLinks, github: e.target.value}
                      })}
                      disabled={!isEditing}
                      className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                      placeholder="GitHub URL"
                    />
                    <input
                      type="url"
                      value={profileData.socialLinks.twitter}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        socialLinks: {...profileData.socialLinks, twitter: e.target.value}
                      })}
                      disabled={!isEditing}
                      className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                      placeholder="Twitter URL"
                    />
                    <input
                      type="url"
                      value={profileData.socialLinks.linkedin}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        socialLinks: {...profileData.socialLinks, linkedin: e.target.value}
                      })}
                      disabled={!isEditing}
                      className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                      placeholder="LinkedIn URL"
                    />
                    <input
                      type="url"
                      value={profileData.socialLinks.portfolio}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        socialLinks: {...profileData.socialLinks, portfolio: e.target.value}
                      })}
                      disabled={!isEditing}
                      className="px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                      placeholder="Portfolio URL"
                    />
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      <FaSave />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 