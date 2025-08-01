import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug } = params;

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            displayName: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if project is private and user has access
    if (project.visibility === 'private' && project.owner.email !== session?.user?.email) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (project.visibility === 'team') {
      const isMember = project.members.some(member => 
        member.user.email === session?.user?.email
      );
      if (!isMember && project.owner.email !== session?.user?.email) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Parse JSON fields
    const formattedProject = {
      ...project,
      platforms: project.platforms ? JSON.parse(project.platforms) : [],
      rolesNeeded: project.rolesNeeded ? JSON.parse(project.rolesNeeded) : [],
      tags: project.tags ? JSON.parse(project.tags) : [],
      screenshots: project.screenshots ? JSON.parse(project.screenshots) : [],
      isOwner: project.owner.email === session?.user?.email,
      isMember: project.members.some(member => 
        member.user.email === session?.user?.email
      ),
    };

    return NextResponse.json(formattedProject);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;
    const body = await request.json();

    // Get the project and check ownership
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        owner: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.owner.email !== session.user.email) {
      return NextResponse.json({ error: 'Only the project owner can edit' }, { status: 403 });
    }

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { slug },
      data: {
        name: body.name,
        description: body.description,
        longDescription: body.longDescription,
        genre: body.genre,
        stage: body.stage,
        platforms: body.platforms ? JSON.stringify(body.platforms) : null,
        engine: body.engine,
        teamSize: body.teamSize,
        lookingForTeam: body.lookingForTeam,
        rolesNeeded: body.rolesNeeded ? JSON.stringify(body.rolesNeeded) : null,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        visibility: body.visibility,
        coverImage: body.coverImage,
        screenshots: body.screenshots ? JSON.stringify(body.screenshots) : null,
        videoUrl: body.videoUrl,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;

    // Get the project and check ownership
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        owner: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.owner.email !== session.user.email) {
      return NextResponse.json({ error: 'Only the project owner can delete' }, { status: 403 });
    }

    // Delete the project (this will cascade delete members)
    await prisma.project.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}