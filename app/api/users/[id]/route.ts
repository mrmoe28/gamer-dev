import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        displayName: true,
        bio: true,
        location: true,
        website: true,
        customImage: true,
        image: true,
        skills: true,
        socialLinks: true,
        lookingForTeam: true,
        availabilityStatus: true,
        preferredRoles: true,
        experience: true,
        createdAt: true,
        _count: {
          select: {
            ownedProjects: true,
            projectMemberships: true
          }
        },
        ownedProjects: {
          where: {
            visibility: 'public'
          },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            genre: true,
            stage: true,
            coverImage: true,
            teamSize: true,
            lookingForTeam: true,
            _count: {
              select: {
                members: true
              }
            }
          },
          orderBy: {
            updatedAt: 'desc'
          },
          take: 6
        },
        projectMemberships: {
          where: {
            project: {
              visibility: 'public'
            }
          },
          select: {
            role: true,
            project: {
              select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                genre: true,
                stage: true,
                coverImage: true,
                teamSize: true,
                owner: {
                  select: {
                    id: true,
                    name: true,
                    displayName: true
                  }
                }
              }
            }
          },
          orderBy: {
            joinedAt: 'desc'
          },
          take: 6
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse JSON fields
    const userData = {
      ...user,
      skills: user.skills ? JSON.parse(user.skills) : null,
      socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : null,
      preferredRoles: user.preferredRoles ? JSON.parse(user.preferredRoles) : null,
      isCurrentUser: user.id === session.user.id
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}