import { prisma } from '@/lib/prisma';
import {
  encrypt,
  decrypt,
  validateResidentId,
  hashResidentId,
} from '@/lib/encryption';

export class UserProfileService {
  /**
   * Saves encrypted resident ID for a user
   * @param userId - User ID
   * @param residentId - Plain text resident ID (YYMMDD-XXXXXXX)
   * @throws Error if validation fails or duplicate exists
   */
  static async saveResidentId(
    userId: string,
    residentId: string
  ): Promise<void> {
    // Validate format
    if (!validateResidentId(residentId)) {
      throw new Error('Invalid resident ID format. Expected: YYMMDD-XXXXXXX');
    }

    // Check for duplicates using hash
    const residentIdHash = hashResidentId(residentId);
    const existingUser = await prisma.user.findUnique({
      where: { residentIdHash },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new Error('This resident ID is already registered');
    }

    // Encrypt
    const { encrypted, iv } = encrypt(residentId);

    // Save to database
    await prisma.user.update({
      where: { id: userId },
      data: {
        encryptedResidentId: encrypted,
        residentIdIv: iv,
        residentIdHash,
      },
    });
  }

  /**
   * Retrieves and decrypts resident ID for a user
   * @param userId - User ID to retrieve
   * @param accessorId - User ID requesting access
   * @returns Decrypted resident ID or null
   * @throws Error if access is denied
   */
  static async getResidentId(
    userId: string,
    accessorId: string
  ): Promise<string | null> {
    // Get both users
    const [user, accessor] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          encryptedResidentId: true,
          residentIdIv: true,
          organizationId: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: accessorId },
        select: {
          id: true,
          role: true,
          organizationId: true,
        },
      }),
    ]);

    if (!user || !accessor) {
      throw new Error('User not found');
    }

    // Check access permissions
    const canAccess = this.canAccessResidentId(user, accessor);
    if (!canAccess) {
      throw new Error('Access denied: Insufficient permissions');
    }

    // Return null if no resident ID stored
    if (!user.encryptedResidentId || !user.residentIdIv) {
      return null;
    }

    // Decrypt and return
    try {
      const decrypted = decrypt(user.encryptedResidentId, user.residentIdIv);

      // TODO: Log access for audit trail
      // await this.logResidentIdAccess(userId, accessorId);

      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt resident ID');
    }
  }

  /**
   * Checks if accessor can view user's resident ID
   * @param user - Target user
   * @param accessor - User requesting access
   * @returns true if access is allowed
   */
  private static canAccessResidentId(
    user: { id: string; organizationId: string },
    accessor: { id: string; role: string; organizationId: string }
  ): boolean {
    // User can access their own data
    if (user.id === accessor.id) {
      return true;
    }

    // Must be in same organization
    if (user.organizationId !== accessor.organizationId) {
      return false;
    }

    // Only ADMIN and SUPER_ADMIN can access other users' resident IDs
    const allowedRoles = ['ADMIN', 'SUPER_ADMIN'];
    return allowedRoles.includes(accessor.role);
  }

  /**
   * Deletes resident ID for a user
   * @param userId - User ID
   */
  static async deleteResidentId(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        encryptedResidentId: null,
        residentIdIv: null,
        residentIdHash: null,
      },
    });
  }

  /**
   * Updates user profile (excluding sensitive fields)
   * @param userId - User ID
   * @param data - Profile data to update
   */
  static async updateProfile(
    userId: string,
    data: {
      name?: string;
      phoneNumber?: string;
      address?: string;
      addressDetail?: string;
      postalCode?: string;
      department?: string;
      position?: string;
      customPositionId?: string;
      hireDate?: Date;
      employeeNumber?: string;
      emergencyContactName?: string;
      emergencyContactPhone?: string;
      emergencyContactRelation?: string;
    }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phoneNumber: true,
        address: true,
        addressDetail: true,
        postalCode: true,
        department: true,
        position: true,
        customPositionId: true,
        hireDate: true,
        employeeNumber: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
        emergencyContactRelation: true,
        role: true,
        organizationId: true,
      },
    });
  }
}
