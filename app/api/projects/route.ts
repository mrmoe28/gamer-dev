import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      genre,
      description,
      longDescription,
      stage,
      platforms,
      engine,
      teamSize,
      lookingForTeam,
      rolesNeeded,
      tags,
      visibility,
      screenshots,
      coverImage,
    } = body;

    // Validate required fields
    if (!name || !genre) {
      return NextResponse.json({ error: 'Name and genre are required' }, { status: 400 });
    }

    // Generate slug from name
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Check if slug exists and make it unique
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        name,
        slug,
        description,
        longDescription,
        genre,
        stage: stage || 'Concept',
        platforms: platforms?.length > 0 ? JSON.stringify(platforms) : null,
        engine,
        teamSize: teamSize || 1,
        lookingForTeam: lookingForTeam || false,
        rolesNeeded: rolesNeeded?.length > 0 ? JSON.stringify(rolesNeeded) : null,
        tags: tags?.length > 0 ? JSON.stringify(tags) : null,
        visibility: visibility || 'public',
        screenshots: screenshots?.length > 0 ? JSON.stringify(screenshots) : null,
        coverImage: coverImage || null,
        ownerId: user.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Add the owner as a project member
    await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId: project.id,
        role: 'Owner',
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const visibility = searchParams.get('visibility');

    const where: any = {};
    
    if (userId) {
      where.ownerId = userId;
    }
    
    if (visibility) {
      where.visibility = visibility;
    } else {
      // Default to public projects
      where.visibility = 'public';
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse JSON fields
    const formattedProjects = projects.map(project => ({
      ...project,
      platforms: project.platforms ? JSON.parse(project.platforms) : [],
      rolesNeeded: project.rolesNeeded ? JSON.parse(project.rolesNeeded) : [],
      tags: project.tags ? JSON.parse(project.tags) : [],
      screenshots: project.screenshots ? JSON.parse(project.screenshots) : [],
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}