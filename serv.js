const { db } = require('./config/firebase');
const { hashPassword } = require('./utils/tokenUtils');

async function insertAdmin(email, password) {
  try {
    const passwordHash = await hashPassword(password);

    const adminData = {
      email,
      password: passwordHash,
      resetTokenHash: null,
      resetTokenExpiry: null,
      createdAt: new Date(),
    };

    await db.collection('admins').add(adminData);
    console.log(`✅ Admin ${email} inserted successfully`);
  } catch (err) {
    console.error('❌ Error inserting admin:', err);
  }
}

insertAdmin('Bonafide@tce.edu', 'tceMDU123');
