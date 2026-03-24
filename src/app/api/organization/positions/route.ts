import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const createPositionSchema = z.object({
  name: z.string().min(2, 'Position name must be at least 2 characters'),
  level: z.number().int().positive('Level must be a positive integer'),
});

/**
 * GET /api/organization/positions - Get all custom positions for user's organization
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const positions = await prisma.customPosition.findMany({
      where: {
        organizationId: session.user.organizationId,
      },
      orderBy: {
        level: 'asc',
      },
      select: {
        id: true,
        name: true,
        level: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    return NextResponse.json({ positions });
  } catch (error) {
    console.error('Positions retrieval error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/organization/positions - Create a new custom position (ADMIN only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is ADMIN or SUPER_ADMIN
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can create positions' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validationResult = createPositionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, level } = validationResult.data;

    // Check if position with same name already exists in organization
    const existingPosition = await prisma.customPosition.findFirst({
      where: {
        organizationId: session.user.organizationId,
        name,
      },
    });

    if (existingPosition) {
      return NextResponse.json(
        { error: 'A position with this name already exists' },
        { status: 409 }
      );
    }

    // Create position
    const position = await prisma.customPosition.create({
      data: {
        name,
        level,
        organizationId: session.user.organizationId,
      },
      select: {
        id: true,
        name: true,
        level: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: 'Position created successfully',
        position,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Position creation error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
