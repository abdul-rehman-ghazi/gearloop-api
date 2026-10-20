// Creates an admin account directly in the database pointed to by
// DATABASE_URL. This is the only way to create the first admin, since
// POST /admin/admins itself requires an admin token.
//
//   read -rs ADMIN_PASSWORD && export ADMIN_PASSWORD
//   DATABASE_URL="<neon url>" npm run admin:create -- --name "Jane Doe" --email jane@example.com
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AdminAuthService } from '../auth/admin-auth.service';
import { parseCreateAdminInput } from './create-admin-input';

async function main(): Promise<void> {
  const dto = await parseCreateAdminInput(
    process.argv.slice(2),
    process.env.ADMIN_PASSWORD,
  );
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error'],
  });
  try {
    const admin = await app.get(AdminAuthService).createAdmin(dto);
    console.log(`Created admin ${String(admin.email)}`);
  } finally {
    await app.close();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
