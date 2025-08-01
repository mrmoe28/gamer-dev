'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import ImageGallery from '@/components/ImageGallery';
import { 
  FaArrowLeft, 
  FaGamepad, 
  FaUsers, 
  FaClock, 
  FaCode, 
  FaDesktop,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaGlobe,
  FaLock,
  FaUserFriends,
  FaTag,
  FaPlay,
  FaImage,
  FaExternalLinkAlt
} from 'react-icons/fa';

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  longDescription: string | null;
  genre: string;
  stage: string;
  platforms: string[];
  engine: string | null;
  coverImage: string | null;
  screenshots: string[];
  videoUrl: string | null;
  teamSize: number;
  lookingForTeam: boolean;
  rolesNeeded: string[];
  tags: string[];
  visibility: string;
  owner: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    displayName: string | null;
  };
  members: Array<{
    id: string;
    role: string;
    joinedAt: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
      displayName: string | null;
    };
  }>;
  createdAt: string;
  updatedAt: string;
  isOwner: boolean;
  isMember: boolean;
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [params.slug]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Project not found');
        } else if (response.status === 403) {
          setError('You do not have access to this project');
        } else {
          throw new Error('Failed to fetch project');
        }
        return;
      }
      const data = await response.json();
      setProject(data);
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    // TODO: Implement join team functionality
    alert('Join team functionality coming soon!');
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${params.slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      router.push('/dashboard');
    } catch (err) {
      alert('Failed to delete project');
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

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return <FaGlobe className="text-green-400" />;
      case 'private':
        return <FaLock className="text-red-400" />;
      case 'team':
        return <FaUserFriends className="text-blue-400" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6">
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
            <p className="text-red-400">{error || 'Project not found'}</p>
          </div>
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
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              {project.coverImage && (
                <div className="h-64 bg-black/20 relative">
                  <img 
                    src={project.coverImage} 
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
                    <div className="flex items-center gap-4 text-gray-300">
                      <span className="flex items-center gap-1">
                        <FaGamepad className="text-purple-400" />
                        {project.genre}
                      </span>
                      <span className="flex items-center gap-1">
                        {getVisibilityIcon(project.visibility)}
                        {project.visibility}
                      </span>
                    </div>
                  </div>
                  
                  {project.isOwner && (
                    <div className="flex gap-2">
                      <Link
                        href={`/projects/${project.slug}/edit`}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={handleDelete}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                {project.description && (
                  <p className="text-gray-300 text-lg mb-6">{project.description}</p>
                )}

                {/* Development Stage */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-gray-400">Development Stage:</span>
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${getStageColor(project.stage)}`}>
                    {project.stage}
                  </span>
                </div>

                {/* Tags */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                      >
                        <FaTag className="text-xs" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Description */}
            {project.longDescription && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-4">About This Project</h2>
                <div className="text-gray-300 whitespace-pre-wrap">{project.longDescription}</div>
              </div>
            )}

            {/* Media Gallery */}
            {(project.screenshots.length > 0 || project.videoUrl) && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FaImage className="text-purple-400" />
                  Media
                </h2>
                
                {project.videoUrl && (
                  <div className="mb-6">
                    <div className="aspect-video bg-black/20 rounded-lg overflow-hidden">
                      <iframe
                        src={project.videoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
                
                {project.screenshots.length > 0 && (
                  <ImageGallery 
                    images={project.screenshots} 
                    title={`${project.name} Screenshots`}
                  />
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Project Info</h2>
              
              <div className="space-y-4">
                {project.engine && (
                  <div>
                    <span className="text-gray-400 text-sm">Engine</span>
                    <p className="text-white flex items-center gap-2">
                      <FaCode className="text-purple-400" />
                      {project.engine}
                    </p>
                  </div>
                )}
                
                {project.platforms.length > 0 && (
                  <div>
                    <span className="text-gray-400 text-sm">Platforms</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.platforms.map((platform, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm"
                        >
                          <FaDesktop className="text-xs" />
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-400 text-sm">Created</span>
                  <p className="text-white flex items-center gap-2">
                    <FaClock className="text-purple-400" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FaUsers className="text-purple-400" />
                Team ({project.members.length + 1}/{project.teamSize})
              </h2>
              
              <div className="space-y-3 mb-4">
                {/* Owner */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-600 flex items-center justify-center">
                    {project.owner.image ? (
                      <img
                        src={project.owner.image}
                        alt={project.owner.displayName || project.owner.name || 'Owner'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-medium">
                        {(project.owner.displayName || project.owner.name || 'O')[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {project.owner.displayName || project.owner.name}
                    </p>
                    <p className="text-gray-400 text-sm">Owner</p>
                  </div>
                </div>
                
                {/* Members */}
                {project.members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">
                      {member.user.image ? (
                        <img
                          src={member.user.image}
                          alt={member.user.displayName || member.user.name || 'Member'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-medium">
                          {(member.user.displayName || member.user.name || 'M')[0]}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {member.user.displayName || member.user.name}
                      </p>
                      <p className="text-gray-400 text-sm">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Join Team Button */}
              {project.lookingForTeam && !project.isOwner && !project.isMember && (
                <div>
                  {project.rolesNeeded.length > 0 && (
                    <div className="mb-3">
                      <p className="text-gray-400 text-sm mb-2">Looking for:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.rolesNeeded.map((role, index) => (
                          <span
                            key={index}
                            className="text-purple-300 text-sm bg-purple-500/20 px-2 py-1 rounded"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handleJoinTeam}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                  >
                    <FaUserPlus />
                    Join Team
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            {!project.isOwner && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Actions</h2>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                    Follow Project
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                    <FaExternalLinkAlt />
                    Share
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Screenshot"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
}