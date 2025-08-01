'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { 
  FaGamepad, 
  FaSignOutAlt, 
  FaPlus, 
  FaUsers, 
  FaChartLine, 
  FaCode, 
  FaPalette, 
  FaMusic, 
  FaComments,
  FaHeart,
  FaEye,
  FaDownload,
  FaStar,
  FaTrophy,
  FaRocket,
  FaLightbulb,
  FaUser,
  FaCog,
  FaChevronDown
} from 'react-icons/fa';
import Link from 'next/link';

interface ProfileData {
  customImage?: string;
  displayName?: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Dashboard - Auth status:', status);
    console.log('Dashboard - Session:', session);
    
    if (status === 'unauthenticated') {
      console.log('Dashboard - User not authenticated, redirecting to signin');
      router.push('/signin');
    }
  }, [status, router, session]);

  // Load profile data to get custom image
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      loadProfileData();
    }
  }, [status, session]);

  const loadProfileData = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfileData({
          customImage: data.customImage,
          displayName: data.displayName
        });
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Determine which image to show (custom image takes priority)
  const displayImage = profileData.customImage || session.user?.image;
  const displayName = profileData.displayName || session.user?.name || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <FaGamepad className="text-purple-400 text-2xl" />
              <span className="text-white font-bold text-xl">Gamer Dev Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-white text-sm">
                Welcome, {displayName}!
              </div>
              
              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 bg-black/20 hover:bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center">
                    {displayImage ? (
                      <img 
                        src={displayImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-white text-sm" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{displayName}</span>
                  <FaChevronDown className={`text-xs transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaUser className="text-purple-400" />
                        <span>Profile Settings</span>
                      </Link>
                      <Link 
                        href="/settings" 
                        className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaCog className="text-blue-400" />
                        <span>Account Settings</span>
                      </Link>
                      <div className="border-t border-white/10 my-1"></div>
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
                      >
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Projects</p>
                <p className="text-white text-2xl font-bold">12</p>
              </div>
              <FaCode className="text-purple-400 text-2xl" />
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Community</p>
                <p className="text-white text-2xl font-bold">2.4K</p>
              </div>
              <FaUsers className="text-blue-400 text-2xl" />
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Downloads</p>
                <p className="text-white text-2xl font-bold">15.2K</p>
              </div>
              <FaDownload className="text-green-400 text-2xl" />
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rating</p>
                <p className="text-white text-2xl font-bold">4.8</p>
              </div>
              <FaStar className="text-yellow-400 text-2xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Projects */}
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-xl font-bold">Recent Projects</h2>
                <Link 
                  href="/projects/new" 
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FaPlus />
                  New Project
                </Link>
              </div>
              <div className="space-y-4">
                <div className="bg-black/10 border border-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">Epic RPG Adventure</h3>
                      <p className="text-gray-400 text-sm">RPG • 5 team members</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm">Updated 2h ago</p>
                      <div className="w-24 bg-gray-700 rounded-full h-2 mt-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-black/10 border border-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">Pixel Shooter</h3>
                      <p className="text-gray-400 text-sm">Action • 3 team members</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm">Updated 1d ago</p>
                      <div className="w-24 bg-gray-700 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-black/10 border border-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">Mind Puzzle</h3>
                      <p className="text-gray-400 text-sm">Puzzle • 2 team members</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm">Updated 3d ago</p>
                      <div className="w-24 bg-gray-700 rounded-full h-2 mt-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Activity */}
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-6">Community Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-black/10 border border-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <FaComments className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm"><span className="font-semibold">Sarah Chen</span> commented on your project</p>
                    <p className="text-gray-400 text-xs">"Love the art style! Can't wait to play!"</p>
                  </div>
                  <span className="text-gray-400 text-xs">5m ago</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-black/10 border border-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <FaHeart className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm"><span className="font-semibold">Mike Johnson</span> liked your project</p>
                    <p className="text-gray-400 text-xs">Epic RPG Adventure</p>
                  </div>
                  <span className="text-gray-400 text-xs">15m ago</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-black/10 border border-white/5 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <FaEye className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm"><span className="font-semibold">Alex Rivera</span> viewed your profile</p>
                    <p className="text-gray-400 text-xs">Game Developer • Unity Expert</p>
                  </div>
                  <span className="text-gray-400 text-xs">1h ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link 
                  href="/projects/new"
                  className="w-full flex items-center gap-3 p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <FaCode />
                  <span>Start New Project</span>
                </Link>
                <Link 
                  href="/teammates"
                  className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FaUsers />
                  <span>Find Teammates</span>
                </Link>
                <button className="w-full flex items-center gap-3 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                  <FaRocket />
                  <span>Launch Project</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
                  <FaTrophy />
                  <span>Join Contest</span>
                </button>
              </div>
            </div>

            {/* Skills & Expertise */}
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-6">Your Skills</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaCode className="text-purple-400" />
                    <span className="text-white">Programming</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`text-sm ${i < 4 ? 'text-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaPalette className="text-blue-400" />
                    <span className="text-white">Art & Design</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`text-sm ${i < 3 ? 'text-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaMusic className="text-green-400" />
                    <span className="text-white">Audio</span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`text-sm ${i < 2 ? 'text-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-6">Recent Achievements</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                  <FaTrophy className="text-yellow-400 text-xl" />
                  <div>
                    <p className="text-white text-sm font-semibold">First Project Published</p>
                    <p className="text-gray-400 text-xs">You published your first game!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg">
                  <FaLightbulb className="text-purple-400 text-xl" />
                  <div>
                    <p className="text-white text-sm font-semibold">Innovation Award</p>
                    <p className="text-gray-400 text-xs">Your unique game mechanics won!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <FaUsers className="text-green-400 text-xl" />
                  <div>
                    <p className="text-white text-sm font-semibold">Team Leader</p>
                    <p className="text-gray-400 text-xs">You led a successful team!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}