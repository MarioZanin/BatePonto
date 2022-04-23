import bcrypt from 'bcrypt';

export default async function compare(password: string, passwordEncrypted: string) {
    const isValidPassword = await bcrypt.compare(password, passwordEncrypted);

    return isValidPassword;
}