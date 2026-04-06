import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getDistributions = async (req, res) => {
  try {
    const distributions = await prisma.feeDistribution.findMany({
        include: {
            unitBrand: { include: { unit: true, brand: true }},
            transferUnit: { include: { unit: true, brand: true }}
        },
        orderBy: { createdAt: 'desc' }
    });
    return sendSuccess(res, distributions);
  } catch (err) {
    return sendError(res, err.message);
  }
};

export const createDistribution = async (req, res) => {
    // Logic for transferring funds between levels based on rulesJson
    return sendSuccess(res, null, 'Phân bổ thành công.');
};
