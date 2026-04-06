import prisma from '../config/database.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getReportSummary = async (req, res) => {
  try {
    const { roleName, unitId, isAdmin } = req.user;
    const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

    let whereUnitId = unitId;

    // Use current logic from report_summary.php to calculate data or fetch from feeSummary (we seed feeSummary mostly for this)
    const summary = await prisma.feeSummary.findFirst({
        where: { unitId: whereUnitId, year }
    });

    if (summary) {
        return sendSuccess(res, summary);
    } else {
        // Compute dynamically if not in summary table
        // For now, return a default zero summary to avoid errors
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
