import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const skills = searchParams.get('skills')?.split(',').filter(Boolean) || [];
    const availability = searchParams.get('availability') || '';
    const experience = searchParams.get('experience') || '';

    // Build where clause
    const where: any = {
      lookingForTeam: true,
      // Exclude the current user
      id: {
        not: session.user.id
      }
    };

    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { skills: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add availability filter
    if (availability) {
      where.availabilityStatus = availability;
    }

    // Add experience filter
    if (experience) {
      where.experience = experience;
    }

    // Fetch developers
    let developers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        displayName: true,
        bio: true,
        location: true,
        customImage: true,
        image: true,
        skills: true,
        lookingForTeam: true,
        availabilityStatus: true,
        preferredRoles: true,
        experience: true,
        _count: {
          select: {
            ownedProjects: true,
            projectMemberships: true
          }
        }
      },
      orderBy: [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Filter by skills if specified
    if (skills.length > 0) {
      developers = developers.filter(dev => {
        if (!dev.skills) return false;
        try {
          const devSkills = JSON.parse(dev.skills);
          return skills.some(skill => skill in devSkills && devSkills[skill] > 0);
        } catch (e) {
          return false;
        }
      });
    }

    // Parse preferredRoles for each developer
    developers = developers.map(dev => ({
      ...dev,
      preferredRoles: dev.preferredRoles ? JSON.parse(dev.preferredRoles) : null
    }));

    return NextResponse.json(developers);
  } catch (error) {
    console.error('Error fetching teammates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teammates' },
      { status: 500 }
    );
  }
}