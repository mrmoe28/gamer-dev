'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft,
  FaUser,
  FaMapMarkerAlt,
  FaGlobe,
  FaEnvelope,
  FaGamepad,
  FaCode,
  FaPalette,
  FaMusic,
  FaLightbulb,
  FaStar,
  FaClock,
  FaEdit,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaTwitch,
  FaDiscord,
  FaSpinner,
  FaExclamationCircle,
  FaUsers,
  FaRocket
} from 'react-icons/fa';

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  displayName: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  customImage: string | null;
  image: string | null;
  skills: { [key: string]: number } | null;
  socialLinks: { [key: string]: string } | null;
  lookingForTeam: boolean;
  availabilityStatus: string;
  preferredRoles: string[] | null;
  experience: string;
  createdAt: string;
  _count: {
    ownedProjects: number;
    projectMemberships: number;
  };
  ownedProjects: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    genre: string;
    stage: string;
    coverImage: string | null;
    teamSize: number;
    lookingForTeam: boolean;
    _count: {
      members: number;
    };
  }>;
  projectMemberships: Array<{
    role: string;
    project: {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      genre: string;
      stage: string;
      coverImage: string | null;
      teamSize: number;
      owner: {
        id: string;
        name: string | null;
        displayName: string | null;
      };
    };
  }>;
  isCurrentUser: boolean;
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

const socialIcons: { [key: string]: any } = {
  twitter: FaTwitter,
  github: FaGithub,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  twitch: FaTwitch,
  discord: FaDiscord,
  website: FaGlobe
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

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    } else if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [status, params.id, router]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('User not found');
        } else {
          throw new Error('Failed to fetch profile');
        }
        return;
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError('Failed to load user profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'Concept': 'bg-gray-500',
      'Pre-Production': 'bg-blue-500',
      'Production': 'bg-yellow-500',
      'Beta': 'bg-purple-500',
      'Released': 'bg-green-500',
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-500';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <FaSpinner className="animate-spin text-2xl" />
          <span className="text-xl">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Link href="/teammates" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6">
            <FaArrowLeft />
            <span>Back to Find Teammates</span>
          </Link>
          
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-8 text-center">
            <FaExclamationCircle className="text-red-400 text-4xl mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
            <p className="text-red-400">{error || 'User not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const displayImage = profile.customImage || profile.image;
  const displayName = profile.displayName || profile.name || 'Anonymous';
  const totalProjects = profile._count.ownedProjects + profile._count.projectMemberships;
  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/teammates" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6">
            <FaArrowLeft />
            <span>Back to Find Teammates</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-8">
              {/* Profile Image */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center">
                  {displayImage ? (
                    <img
                      src={displayImage}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-white text-5xl" />
                  )}
                </div>
              </div>

              {/* Name and Status */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">{displayName}</h1>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm ${availabilityColors[profile.availabilityStatus as keyof typeof availabilityColors]}`}>
                    <FaClock className="text-xs" />
                    {availabilityLabels[profile.availabilityStatus as keyof typeof availabilityLabels]}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {experienceLevels[profile.experience as keyof typeof experienceLevels]} Developer
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{totalProjects}</p>
                  <p className="text-gray-400 text-sm">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{profile.skills ? Object.keys(profile.skills).length : 0}</p>
                  <p className="text-gray-400 text-sm">Skills</p>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mb-6">
                  <p className="text-gray-300 text-sm">{profile.bio}</p>
                </div>
              )}

              {/* Info */}
              <div className="space-y-3 mb-6">
                {profile.location && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaMapMarkerAlt className="text-purple-400" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaGlobe className="text-purple-400" />
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
                      {profile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-300">
                  <FaClock className="text-purple-400" />
                  <span className="text-sm">Member since {memberSince}</span>
                </div>
              </div>

              {/* Social Links */}
              {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">Connect</h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(profile.socialLinks).map(([platform, url]) => {
                      const Icon = socialIcons[platform] || FaGlobe;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg flex items-center justify-center text-purple-400 hover:text-purple-300 transition-all"
                        >
                          <Icon className="text-lg" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                {profile.isCurrentUser ? (
                  <Link
                    href="/profile"
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </Link>
                ) : (
                  <>
                    <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                      <FaEnvelope />
                      <span>Send Message</span>
                    </button>
                    {profile.lookingForTeam && (
                      <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                        <FaUsers />
                        <span>Invite to Team</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills */}
            {profile.skills && Object.keys(profile.skills).length > 0 && (
              <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                  <FaStar className="text-purple-400" />
                  Skills & Expertise
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(profile.skills)
                    .sort(([, a], [, b]) => b - a)
                    .map(([skill, rating]) => {
                      const Icon = skillIcons[skill] || FaCode;
                      return (
                        <div key={skill} className="flex items-center justify-between bg-black/30 border border-white/5 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Icon className="text-purple-400 text-xl" />
                            <span className="text-white font-medium">{skill}</span>
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Looking For */}
            {profile.lookingForTeam && profile.preferredRoles && profile.preferredRoles.length > 0 && (
              <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Looking For</h2>
                <div className="flex flex-wrap gap-3">
                  {profile.preferredRoles.map((role, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <FaRocket className="text-purple-400" />
                Projects
              </h2>

              {/* Owned Projects */}
              {profile.ownedProjects.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-300 mb-4">Created Projects</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.ownedProjects.map(project => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="bg-black/30 border border-white/5 rounded-lg overflow-hidden hover:bg-black/40 transition-colors"
                      >
                        {project.coverImage && (
                          <div className="h-32 bg-black/20">
                            <img
                              src={project.coverImage}
                              alt={project.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="text-white font-semibold mb-1">{project.name}</h4>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{project.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-purple-400">{project.genre}</span>
                            <span className={`px-2 py-1 rounded text-white text-xs ${getStageColor(project.stage)}`}>
                              {project.stage}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                            <FaUsers />
                            <span>{project._count.members + 1}/{project.teamSize}</span>
                            {project.lookingForTeam && (
                              <span className="ml-auto text-green-400">Recruiting</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Member Projects */}
              {profile.projectMemberships.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-4">Contributing To</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.projectMemberships.map(membership => (
                      <Link
                        key={membership.project.id}
                        href={`/projects/${membership.project.slug}`}
                        className="bg-black/30 border border-white/5 rounded-lg overflow-hidden hover:bg-black/40 transition-colors"
                      >
                        {membership.project.coverImage && (
                          <div className="h-32 bg-black/20">
                            <img
                              src={membership.project.coverImage}
                              alt={membership.project.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="text-white font-semibold mb-1">{membership.project.name}</h4>
                          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{membership.project.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-400">Role: {membership.role}</span>
                            <span className={`px-2 py-1 rounded text-white text-xs ${getStageColor(membership.project.stage)}`}>
                              {membership.project.stage}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs mt-2">
                            by {membership.project.owner.displayName || membership.project.owner.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {profile.ownedProjects.length === 0 && profile.projectMemberships.length === 0 && (
                <p className="text-gray-400 text-center py-8">No projects yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}