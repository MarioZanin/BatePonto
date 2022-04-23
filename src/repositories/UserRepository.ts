import { IUser } from '../interfaces/IUser';
import { User } from '../schemas/User';

export default class UserRepository {

    public async findAll(company) {
        return await User.find({ company: company });
    }

    public async findByEmailOrCpf(email: string, cpf?: string) {
        return await User.findOne({ $or: [{ email: email }, { cpf: cpf }] });
    }

    public async findEmployeeByName(name, adminCompanyId) {
        return await User.find({ $and: [{ name: { $regex: new RegExp(name, "i") } }, { company: adminCompanyId }] })
    }

    public async findById(id: string) {
        return await User.findOne({ _id: id }).populate('company');
    }

    public async adminUpdateUser(id: string, isAdmin: boolean) {
        return await User.findOneAndUpdate({ _id: id }, { isAdmin: isAdmin });
    }

    public async update(id: string, {
        name,
        email,
        password,
        cpf,
        cellphone
    }) {
        return await User.findOneAndUpdate({ _id: id },
            {
                name,
                email,
                password,
                cpf,
                cellphone
            });
    }

    public async updatePassword(id: string, password: string) {
        return await User.findOneAndUpdate({ _id: id }, { password: password });
    }

    public async remove(id: string) {
        return await User.findOneAndRemove({ _id: id });
    }

    public async save(user: IUser) {
        return await User.create(user);
    }
}