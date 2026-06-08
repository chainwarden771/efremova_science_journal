import mongoose from 'mongoose';

export async function connectMongoDB() {
  try {
    await mongoose.connect(
      'mongodb://admin:admin@localhost:27017/ScienceJournalDB?authSource=admin',
    );

    console.log('🔌 [MongoDB] Подключен');
  } catch (error) {
    console.error('❌ [MongoDB] Подключение не удалось:', error);

    process.exit(1);
  }
}
