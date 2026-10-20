import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { parseArgs } from 'node:util';
import { CreateAdminDto } from '../auth/dto/create-admin.dto';

// The password comes from the environment, not argv, so it never lands in
// shell history or the process list.
export async function parseCreateAdminInput(
  argv: string[],
  password: string | undefined,
): Promise<CreateAdminDto> {
  const { values } = parseArgs({
    args: argv,
    options: { name: { type: 'string' }, email: { type: 'string' } },
  });
  const dto = plainToInstance(CreateAdminDto, { ...values, password });
  await assertValid(dto);
  return dto;
}

async function assertValid(dto: CreateAdminDto): Promise<void> {
  const errors = await validate(dto);
  if (errors.length === 0) return;

  const messages = errors.flatMap((error) =>
    Object.values(error.constraints ?? {}),
  );
  throw new Error(`Invalid admin details: ${messages.join('; ')}`);
}
