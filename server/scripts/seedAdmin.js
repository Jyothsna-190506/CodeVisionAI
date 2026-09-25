import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not set in environment.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('🔌 Connected to MongoDB Atlas for Admin Seeding');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@codevision.ai';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
    const adminName = process.env.ADMIN_NAME || 'CodeVision Admin';

    let admin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (admin) {
      admin.role = 'ADMIN';
      admin.name = adminName;
      admin.password = adminPassword;
      await admin.save();
      console.log(`✅ Admin account updated for ${adminEmail}`);
    } else {
      admin = await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: 'ADMIN',
        isActive: true,
      });
      console.log(`✅ Admin account created successfully for ${adminEmail}`);
    }

    await mongoose.connection.close();
    console.log('🏁 Admin seed complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Admin seed failed:', err.message);
    process.exit(1);
  }
};

seedAdmin();
