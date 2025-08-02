'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaUpload, FaPlus, FaTimes, FaGamepad, FaImage } from 'react-icons/fa';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

const GENRES = ['RPG', 'Action', 'Puzzle', 'Strategy', 'Adventure', 'Simulation', 'Sports', 'Racing', 'Fighting', 'Platformer'];
const STAGES = ['Concept', 'Pre-Production', 'Production', 'Beta', 'Released'];
const PLATFORMS = ['PC', 'Mobile', 'Console', 'Web', 'VR'];
const ENGINES = ['Unity', 'Unreal Engine', 'Godot', 'GameMaker', 'Construct', 'Custom', 'Other'];
const ROLES = ['Programmer', 'Artist', 'Game Designer', 'Sound Designer', 'Writer', 'Producer', 'QA Tester', 'Marketing'];

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    description: '',
    longDescription: '',
    stage: 'Concept',
    platforms: [] as string[],
    engine: '',
    teamSize: 1,
    lookingForTeam: false,
    rolesNeeded: [] as string[],
    tags: [] as string[],
    visibility: 'public',
    screenshots: [] as string[],
    coverImage: '',
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const project = await response.json();
      router.push(`/projects/${project.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      rolesNeeded: prev.rolesNeeded.includes(role)
        ? prev.rolesNeeded.filter(r => r !== role)
        : [...prev.rolesNeeded, role]
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  return (
    <div className="gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6">
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">Create New Project</h1>
          <p className="text-gray-300">Share your game project with the community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <FaGamepad className="text-purple-400" />
                Basic Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Enter your project name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white mb-2">Genre *</label>
                    <select
                      required
                      value={formData.genre}
                      onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
                    >
                      <option value="">Select a genre</option>
                      {GENRES.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white mb-2">Development Stage</label>
                    <select
                      value={formData.stage}
                      onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
                    >
                      {STAGES.map(stage => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Short Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    maxLength={280}
                    rows={3}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                    placeholder="Brief description of your project (280 characters max)"
                  />
                  <p className="text-gray-400 text-sm mt-1">{formData.description.length}/280 characters</p>
                </div>

                <div>
                  <label className="block text-white mb-2">Detailed Description</label>
                  <textarea
                    value={formData.longDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                    rows={6}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                    placeholder="Provide a detailed description of your game, its features, story, and what makes it unique..."
                  />
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Technical Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Target Platforms</label>
                  <div className="flex flex-wrap gap-3">
                    {PLATFORMS.map(platform => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => handlePlatformToggle(platform)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          formData.platforms.includes(platform)
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                            : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Game Engine/Framework</label>
                  <select
                    value={formData.engine}
                    onChange={(e) => setFormData(prev => ({ ...prev, engine: e.target.value }))}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="">Select an engine</option>
                    {ENGINES.map(engine => (
                      <option key={engine} value={engine}>{engine}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Media & Screenshots */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <FaImage className="text-purple-400" />
                Media & Screenshots
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Game Screenshots</label>
                  <p className="text-gray-400 text-sm mb-4">
                    Upload screenshots to showcase your game. The first image will be used as the cover image.
                  </p>
                  <ImageUpload 
                    onImagesChange={(images) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        screenshots: images,
                        coverImage: images[0] || ''
                      }));
                    }}
                    maxImages={10}
                    existingImages={formData.screenshots}
                  />
                </div>
              </div>
            </div>

            {/* Team & Collaboration */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Team & Collaboration</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Team Size</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.teamSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.lookingForTeam}
                      onChange={(e) => setFormData(prev => ({ ...prev, lookingForTeam: e.target.checked }))}
                      className="w-5 h-5 bg-black/20 border border-white/10 rounded text-purple-500 focus:ring-purple-500"
                    />
                    <span className="text-white">Looking for team members</span>
                  </label>
                </div>

                {formData.lookingForTeam && (
                  <div>
                    <label className="block text-white mb-2">Roles Needed</label>
                    <div className="flex flex-wrap gap-3">
                      {ROLES.map(role => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleRoleToggle(role)}
                          className={`px-4 py-2 rounded-lg border transition-all ${
                            formData.rolesNeeded.includes(role)
                              ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                              : 'bg-black/20 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags & Discovery */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6">Tags & Discovery</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white mb-2">Project Tags</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                    placeholder="Type a tag and press Enter"
                  />
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-purple-100"
                            aria-label={`Remove ${tag} tag`}
                            title={`Remove ${tag} tag`}
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white mb-2">Visibility</label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="public">Public - Anyone can see this project</option>
                    <option value="private">Private - Only you can see this project</option>
                    <option value="team">Team Only - Only team members can see this project</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 border border-white/10 text-gray-300 hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.genre}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FaPlus />
                    Create Project
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}