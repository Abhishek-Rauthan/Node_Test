import bcrypt from "bcrypt";

export async function hashPassword(password: string) {
  const rounds = Number(process.env.salt!);
  let hashedPassword: string | null = await bcrypt.hash(password, rounds);

  return hashedPassword;
}
