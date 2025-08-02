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
        { error: 'You must be logged in to leave a team' },
        { status: 401 }
      );
    }

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
      where: { slug: params.slug }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if user is the owner
    if (project.ownerId === user.id) {
      return NextResponse.json(
        { error: 'Project owners cannot leave their own project' },
        { status: 400 }
      );
    }

    // Find and delete the membership
    const membership = await prisma.projectMember.findFirst({
      where: {
        userId: user.id,
        projectId: project.id
      }
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'You are not a member of this team' },
        { status: 400 }
      );
    }

    await prisma.projectMember.delete({
      where: { id: membership.id }
    });

    return NextResponse.json({
      message: 'Successfully left the team'
    });

  } catch (error) {
    console.error('Error leaving team:', error);
    return NextResponse.json(
      { error: 'Failed to leave team' },
      { status: 500 }
    );
  }
}