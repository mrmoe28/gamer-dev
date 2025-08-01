'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaUser,
  FaStar,
  FaMapMarkerAlt,
  FaEnvelope,
  FaGamepad,
  FaCode,
  FaPalette,
  FaMusic,
  FaLightbulb,
  FaUserPlus,
  FaEye,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';

interface Developer {
  id: string;
  name: string | null;
  email: string;
  displayName: string | null;
  bio: string | null;
  location: string | null;
  customImage: string | null;
  image: string | null;
  skills: string | null;
  lookingForTeam: boolean;
  availabilityStatus: string;
  preferredRoles: string[] | null;
  experience: string;
  _count: {
    ownedProjects: number;
    projectMemberships: number;
  };
}

const availabilityColors = {
  available: 'bg-green-500',
  busy: 'bg-red-500',
  open_to_offers: 'bg-yellow-500'
};

const availabilityLabels = {
  available: 'Available',
  busy: 'Busy',
  open_to_offers: 'Open to Offers'
};

const experienceLevels = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  expert: 'Expert'
};

const skillIcons: { [key: string]: any } = {
  'Programming': FaCode,
  'Art': FaPalette,
  'Music': FaMusic,
  'Design': FaLightbulb,
  'Unity': FaGamepad,
  'Unreal': FaGamepad,
  'Godot': FaGamepad,
  'C#': FaCode,
  'JavaScript': FaCode,
  'Python': FaCode,
  'C++': FaCode,
  '3D Art': FaPalette,
  '2D Art': FaPalette,
  'UI/UX': FaPalette,
  'Sound Design': FaMusic,
  'Composition': FaMusic,
  'Game Design': FaLightbulb,
  'Level Design': FaLightbulb,
  'Writing': FaLightbulb
};

export default function FindTeammates() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    } else if (status === 'authenticated') {
      fetchDevelopers();
    }
  }, [status, router]);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedSkills.length > 0) params.append('skills', selectedSkills.join(','));
      if (selectedAvailability) params.append('availability', selectedAvailability);
      if (selectedExperience) params.append('experience', selectedExperience);

      const response = await fetch(`/api/teammates?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch developers');
      }
      const data = await response.json();
      setDevelopers(data);
    } catch (err) {
      setError('Failed to load developers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (status === 'authenticated') {
        fetchDevelopers();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedSkills, selectedAvailability, selectedExperience]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const getAllSkills = () => {
    const skillSet = new Set<string>();
    developers.forEach(dev => {
      if (dev.skills) {
        try {
          const skills = JSON.parse(dev.skills);
          Object.keys(skills).forEach(skill => skillSet.add(skill));
        } catch (e) {
          // Handle invalid JSON
        }
      }
    });
    return Array.from(skillSet).sort();
  };

  const getSkillRating = (skills: string | null, skillName: string): number => {
    if (!skills) return 0;
    try {
      const skillsObj = JSON.parse(skills);
      return skillsObj[skillName] || 0;
    } catch (e) {
      return 0;
    }
  };

  const getTopSkills = (skills: string | null, limit: number = 3) => {
    if (!skills) return [];
    try {
      const skillsObj = JSON.parse(skills);
      return Object.entries(skillsObj)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, limit)
        .map(([skill, rating]) => ({ skill, rating: rating as number }));
    } catch (e) {
      return [];
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <FaSpinner className="animate-spin text-2xl" />
          <span className="text-xl">Loading developers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6">
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">Find Teammates</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaFilter />
              Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6">Filters</h2>
              
              {/* Search */}
              <div className="mb-6">
                <label className="text-gray-300 text-sm mb-2 block">Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name, bio, skills..."
                    className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <label className="text-gray-300 text-sm mb-2 block">Availability</label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">All</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="open_to_offers">Open to Offers</option>
                </select>
              </div>

              {/* Experience Filter */}
              <div className="mb-6">
                <label className="text-gray-300 text-sm mb-2 block">Experience Level</label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Skills Filter */}
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Skills</label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.keys(skillIcons).map(skill => (
                    <label key={skill} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="rounded border-gray-600 bg-black/30 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-white text-sm">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Developers Grid */}
          <div className="lg:col-span-3">
            {error ? (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 text-center">
                <FaExclamationCircle className="text-red-400 text-3xl mx-auto mb-3" />
                <p className="text-red-400">{error}</p>
              </div>
            ) : developers.length === 0 ? (
              <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
                <FaUsers className="text-gray-400 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Developers Found</h3>
                <p className="text-gray-400">Try adjusting your filters or search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {developers.map(developer => {
                  const displayImage = developer.customImage || developer.image;
                  const displayName = developer.displayName || developer.name || 'Anonymous';
                  const topSkills = getTopSkills(developer.skills);
                  const totalProjects = developer._count.ownedProjects + developer._count.projectMemberships;

                  return (
                    <div key={developer.id} className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-black/30 transition-all duration-300">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center flex-shrink-0">
                          {displayImage ? (
                            <img
                              src={displayImage}
                              alt={displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaUser className="text-white text-2xl" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-1">{displayName}</h3>
                          <div className="flex items-center gap-3 text-sm">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-white ${availabilityColors[developer.availabilityStatus as keyof typeof availabilityColors]}`}>
                              <FaClock className="text-xs" />
                              {availabilityLabels[developer.availabilityStatus as keyof typeof availabilityLabels]}
                            </span>
                            <span className="text-gray-400">
                              {experienceLevels[developer.experience as keyof typeof experienceLevels]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      {developer.bio && (
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{developer.bio}</p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        {developer.location && (
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-purple-400" />
                            <span>{developer.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <FaGamepad className="text-purple-400" />
                          <span>{totalProjects} projects</span>
                        </div>
                      </div>

                      {/* Top Skills */}
                      {topSkills.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {topSkills.map(({ skill, rating }) => {
                              const Icon = skillIcons[skill] || FaCode;
                              return (
                                <div key={skill} className="flex items-center gap-2 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                                  <Icon className="text-xs" />
                                  <span>{skill}</span>
                                  <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <FaStar key={i} className={`text-xs ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Preferred Roles */}
                      {developer.preferredRoles && developer.preferredRoles.length > 0 && (
                        <div className="mb-4">
                          <p className="text-gray-400 text-xs mb-1">Looking for roles:</p>
                          <div className="flex flex-wrap gap-1">
                            {developer.preferredRoles.map((role, index) => (
                              <span key={index} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Link
                          href={`/users/${developer.id}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                        >
                          <FaEye />
                          <span>View Profile</span>
                        </Link>
                        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                          <FaEnvelope />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}