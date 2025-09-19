const cron = require('node-cron');
const { db } = require('../config/firebase');

async function deleteOldBonafideForms() {
  try {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const snapshot = await db
      .collection('bonafideForms')
      .where('createdAt', '<=', twoMonthsAgo)
      .get();

    if (!snapshot.empty) {
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      console.log(`[Cron] Deleted ${snapshot.size} old bonafide forms`);
    } else {
      console.log('[Cron] No old bonafide forms to delete');
    }
  } catch (err) {
    console.error('[Cron] Error deleting old bonafide forms:', err);
  }
}

// Schedule: Run every day at 00:00 (midnight)
cron.schedule('0 0 * * *', () => {
  console.log('[Cron] Running scheduled deletion...');
  deleteOldBonafideForms();
});

module.exports = deleteOldBonafideForms;
