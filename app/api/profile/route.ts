import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
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
        createdAt: true,
        updatedAt: true,
      },
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
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
          createdAt: true,
          updatedAt: true,
        },
      });
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
      customImage,
      skills,
      socialLinks,
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

    // Check if user exists, if not create them
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        },
      });
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        displayName: displayName || null,
        bio: bio || null,
        location: location || null,
        website: website || null,
        customImage: customImage || null,
        skills: skills ? JSON.stringify(skills) : null,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        updatedAt: new Date(),
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
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 