import bcrypt from 'bcrypt';

export default async function encrypt(password: string) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    return passwordHash;
}