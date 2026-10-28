import AuditLog from '../models/AuditLog.js';

export const createAuditLog = async ({ admin, actionType, targetType, targetId, targetName, before, after, description }) => {
  try {
    await AuditLog.create({
      admin: admin._id,
      adminName: admin.name,
      adminEmail: admin.email,
      actionType,
      targetType,
      targetId: targetId?.toString(),
      targetName,
      before,
      after,
      description
    });
  } catch (error) {
    console.error('Audit log creation failed:', error.message);
  }
};
