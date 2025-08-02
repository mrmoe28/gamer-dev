import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to join a team' },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();
    const { role = 'Team Member' } = body;

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the project
    const project = await prisma.project.findUnique({
      where: { slug: params.slug },
      include: {
        members: {
          where: { userId: user.id }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user is already the owner
    if (project.ownerId === user.id) {
      return NextResponse.json(
        { error: 'You are already the owner of this project' },
        { status: 400 }
      );
    }

    // Check if user is already a member
    if (project.members.length > 0) {
      return NextResponse.json(
        { error: 'You are already a member of this team' },
        { status: 400 }
      );
    }

    // Check if the project is looking for team members
    if (!project.lookingForTeam) {
      return NextResponse.json(
        { error: 'This project is not currently looking for team members' },
        { status: 400 }
      );
    }

    // Check if the team is full
    const currentMemberCount = await prisma.projectMember.count({
      where: { projectId: project.id }
    });

    if (currentMemberCount >= project.teamSize - 1) { // -1 for owner
      return NextResponse.json(
        { error: 'This team is already full' },
        { status: 400 }
      );
    }

    // Add the user as a team member
    const projectMember = await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId: project.id,
        role: role,
      },
      include: {
        user: true,
        project: true
      }
    });

    return NextResponse.json({
      message: 'Successfully joined the team!',
      member: projectMember
    });

  } catch (error) {
    console.error('Error joining team:', error);
    return NextResponse.json(
      { error: 'Failed to join team' },
      { status: 500 }
    );
  }
}