import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getReportSummary = async (req, res) => {
  try {
    const { roleName, unitId, isAdmin } = req.user;
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    let whereUnitId = unitId;


    const summary = await prisma.feeSummary.findFirst({
        where: { unitId: whereUnitId, year }
    });

    if (summary) {
        return sendSuccess(res, summary);
    } else {


        return sendSuccess(res, {
            totalMembers: 0, paidMembers: 0, unpaidMembers: 0,
            totalActivities: 0, approvedActivities: 0, activeActivities: 0,
            totalIncome: 0, totalExpense: 0, year
        });
    }

  } catch (err) {
    return sendError(res, err.message);
  }
};
