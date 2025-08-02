// API Response Types

// User/Profile Types
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  displayName: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  image: string | null;
  customImage: string | null;
  skills: Record<string, number> | null;
  socialLinks: Record<string, string> | null;
  lookingForTeam: boolean;
  availabilityStatus: string;
  preferredRoles: string[];
  experience: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    ownedProjects: number;
    projectMemberships: number;
  };
  ownedProjects?: Project[];
  projectMemberships?: ProjectMembership[];
}

// Project Types
export interface Project {
  id: string;
  name: string;
  slug: string;
  genre: string;
  description: string | null;
  longDescription: string | null;
  stage: string;
  platforms: string[];
  engine: string | null;
  teamSize: number;
  lookingForTeam: boolean;
  rolesNeeded: string[];
  tags: string[];
  visibility: string;
  coverImage: string | null;
  screenshots: string[];
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: UserProfile;
  members: ProjectMember[];
  isOwner?: boolean;
  isMember?: boolean;
}

export interface ProjectMember {
  id: string;
  role: string;
  joinedAt: string;
  userId: string;
  projectId: string;
  user: UserProfile;
  project?: Project;
}

export interface ProjectMembership {
  id: string;
  role: string;
  joinedAt: string;
  project: Project;
}

// API Request Types
export interface CreateProjectRequest {
  name: string;
  genre: string;
  description?: string;
  longDescription?: string;
  stage?: string;
  platforms?: string[];
  engine?: string;
  teamSize?: number;
  lookingForTeam?: boolean;
  rolesNeeded?: string[];
  tags?: string[];
  visibility?: string;
  coverImage?: string;
  screenshots?: string[];
}

export interface UpdateProfileRequest {
  displayName?: string;
  email?: string;
  bio?: string;
  location?: string;
  website?: string;
  customImage?: string;
  skills?: Record<string, number>;
  socialLinks?: Record<string, string>;
  lookingForTeam?: boolean;
  availabilityStatus?: string;
  preferredRoles?: string;
  experience?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Teammate/Developer Search Types
export interface Developer {
  id: string;
  email: string;
  name: string | null;
  displayName: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  image: string | null;
  customImage: string | null;
  skills: string | null; // JSON string
  socialLinks: string | null; // JSON string
  lookingForTeam: boolean;
  availabilityStatus: string;
  preferredRoles: string[]; // Parsed from JSON
  experience: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    ownedProjects: number;
    projectMemberships: number;
  };
}

// Upload Response
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}