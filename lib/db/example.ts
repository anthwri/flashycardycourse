import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { usersTable } from './schema';

async function main() {
  console.log('🗃️  Running Drizzle example operations...\n');

  // Create a new user
  const user: typeof usersTable.$inferInsert = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com',
  };

  console.log('📝 Creating new user...');
  const insertResult = await db.insert(usersTable).values(user).returning();
  console.log('✅ New user created!', insertResult[0]);

  // Read all users
  console.log('\n📖 Getting all users from the database...');
  const users = await db.select().from(usersTable);
  console.log('👥 All users:', users);

  // Update user
  console.log('\n✏️  Updating user age...');
  const updateResult = await db
    .update(usersTable)
    .set({ age: 31 })
    .where(eq(usersTable.email, user.email))
    .returning();
  console.log('✅ User updated!', updateResult[0]);

  // Delete user
  console.log('\n🗑️  Deleting user...');
  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log('✅ User deleted!');

  console.log('\n🎉 Example completed successfully!');
}

// Only run if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Example failed:', error);
    process.exit(1);
  });
}

export { main as runDrizzleExample };
