import { parseCreateAdminInput } from './create-admin-input';

const validArgs = ['--name', 'Jane Doe', '--email', 'jane@example.com'];

describe('parseCreateAdminInput', () => {
  it('builds the admin from argv plus the password from the environment', async () => {
    const dto = await parseCreateAdminInput(validArgs, 'long-enough-pw');

    expect(dto).toEqual({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'long-enough-pw',
    });
  });

  it('rejects a missing password', async () => {
    await expect(parseCreateAdminInput(validArgs, undefined)).rejects.toThrow(
      'Invalid admin details',
    );
  });

  it('rejects a password shorter than 8 characters', async () => {
    await expect(parseCreateAdminInput(validArgs, 'short')).rejects.toThrow(
      'password must be longer than or equal to 8 characters',
    );
  });

  it('rejects an invalid email', async () => {
    const args = ['--name', 'Jane Doe', '--email', 'not-an-email'];

    await expect(parseCreateAdminInput(args, 'long-enough-pw')).rejects.toThrow(
      'email must be an email',
    );
  });
});
