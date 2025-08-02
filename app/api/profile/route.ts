import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log('Profile API - Session:', session?.user?.email);
    
    if (!session?.user?.email) {
      console.log('Profile API - No session or email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        displayName: true,
        bio: true,
        location: true,
        website: true,
        customImage: true,
        skills: true,
        socialLinks: true,
        lookingForTeam: true,
        availabilityStatus: true,
        preferredRoles: true,
        experience: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // If user doesn't exist, create them with default values
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          skills: JSON.stringify({ programming: 4, art: 3, audio: 2 }),
          socialLinks: JSON.stringify({
            github: '',
            twitter: '',
            linkedin: '',
            portfolio: ''
          }),
          preferredRoles: JSON.stringify([]),
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          displayName: true,
          bio: true,
          location: true,
          website: true,
          customImage: true,
          skills: true,
          socialLinks: true,
          lookingForTeam: true,
          availabilityStatus: true,
          preferredRoles: true,
          experience: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    // Handle null case (TypeScript safety)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse JSON fields
    const profile = {
      ...user,
      skills: user.skills ? JSON.parse(user.skills) : { programming: 4, art: 3, audio: 2 },
      socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : {
        github: '',
        twitter: '',
        linkedin: '',
        portfolio: ''
      },
      preferredRoles: user.preferredRoles ? JSON.parse(user.preferredRoles) : [],
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      displayName,
      bio,
      location,
      website,
      skills,
      socialLinks,
      preferredRoles,
      lookingForTeam,
      availabilityStatus,
    } = body;

    // Validate skills object
    if (skills && typeof skills === 'object') {
      const validSkills = ['programming', 'art', 'audio'];
      for (const skill of validSkills) {
        if (skills[skill] && (skills[skill] < 1 || skills[skill] > 5)) {
          return NextResponse.json({ error: 'Skills must be between 1 and 5' }, { status: 400 });
        }
      }
    }

    // Update user profile using upsert to handle both create and update
    const updatedUser = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {
        displayName: displayName || null,
        bio: bio || null,
        location: location || null,
        website: website || null,
        skills: skills ? JSON.stringify(skills) : null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        preferredRoles: preferredRoles ? JSON.stringify(preferredRoles) : JSON.stringify([]),
        lookingForTeam: lookingForTeam !== undefined ? lookingForTeam : false,
        availabilityStatus: availabilityStatus || "available",
        updatedAt: new Date(),
      },
      create: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        displayName: displayName || null,
        bio: bio || null,
        location: location || null,
        website: website || null,
        skills: skills ? JSON.stringify(skills) : null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        preferredRoles: preferredRoles ? JSON.stringify(preferredRoles) : JSON.stringify([]),
        lookingForTeam: lookingForTeam !== undefined ? lookingForTeam : false,
        availabilityStatus: availabilityStatus || "available",
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        displayName: true,
        bio: true,
        location: true,
        website: true,
        customImage: true,
        skills: true,
        socialLinks: true,
        lookingForTeam: true,
        availabilityStatus: true,
        preferredRoles: true,
        experience: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Parse JSON fields for response
    const profile = {
      ...updatedUser,
      skills: updatedUser.skills ? JSON.parse(updatedUser.skills) : { programming: 4, art: 3, audio: 2 },
      socialLinks: updatedUser.socialLinks ? JSON.parse(updatedUser.socialLinks) : {
        github: '',
        twitter: '',
        linkedin: '',
        portfolio: ''
      },
      preferredRoles: updatedUser.preferredRoles ? JSON.parse(updatedUser.preferredRoles) : [],
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 