const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const { sendMonthlyReportEmail } = require('../helper/sendMonthlyReportEmail');
const { generateBonafideExcel } = require('../utils/monthlyReport');

const db = admin.firestore();

const generateMonthlyReport = async (req, res) => {
  try {
    const [year, month] = req.params.monthYear.split('-').map(Number);

    if (!year || !month || month < 1 || month > 12) {
      return res
        .status(400)
        .send('Invalid format. Use YYYY-MM (e.g., 2025-07).');
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

    const filePath = path.join(
      reportsDir,
      `Bonafide_Report_${month}_${year}.xlsx`
    );
    const snap = await db
      .collection('bonafideForms')
      .where('date', '>=', startStr)
      .where('date', '<=', endStr)
      .get();

    if (snap.empty) {
      return res.status(404).send('No submissions found for this month.');
    }

    const students = snap.docs.map((doc) => doc.data());

    await generateBonafideExcel(filePath, start, end, students);

    sendMonthlyReportEmail(filePath, start, end).catch((err) =>
      console.error('Error sending report email:', err.message)
    );

    res.download(filePath, `Bonafide_Report_${month}_${year}.xlsx`);
  } catch (err) {
    console.error('Error generating report:', err.message);
    res.status(500).send('Failed to generate and send monthly report.');
  }
};

module.exports = { generateMonthlyReport };
