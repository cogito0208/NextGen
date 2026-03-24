import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import { UserProfileService } from '@/services/user-profile.service';
import { prisma } from '@/lib/prisma';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  addressDetail: z.string().optional(),
  postalCode: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  customPositionId: z.string().optional(),
  hireDate: z.string().datetime().optional(),
  employeeNumber: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  residentId: z.string().regex(/^\d{6}-\d{7}$/).optional(),
});

/**
 * GET /api/user/profile - Get current user's profile
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        phoneNumber: true,
        address: true,
        addressDetail: true,
        postalCode: true,
        department: true,
        position: true,
        customPositionId: true,
        customPosition: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        hireDate: true,
        employeeNumber: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        emergencyContactRelation: true,
        role: true,
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
          },
        },
        lastLoginAt: true,
        createdAt: true,
        // Note: Encrypted fields are NOT included for security
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/profile - Update current user's profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validationResult = updateProfileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { residentId, hireDate, ...profileData } = validationResult.data;

    // Handle resident ID separately (encrypted)
    if (residentId) {
      try {
        await UserProfileService.saveResidentId(session.user.id, residentId);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to save resident ID';
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    // Update profile
    const updateData: any = { ...profileData };
    if (hireDate) {
      updateData.hireDate = new Date(hireDate);
    }

    const updatedUser = await UserProfileService.updateProfile(
      session.user.id,
      updateData
    );

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
