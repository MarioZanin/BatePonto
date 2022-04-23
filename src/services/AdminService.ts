import { IUser } from '../interfaces/IUser';
import encrypt from '../providers/passwordProvider';
import UserRepository from '../repositories/UserRepository';

export default class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async verifyAdminPermission(adminId: string) {
    const userAdmin = await this.find(adminId);

    if (!userAdmin?.isAdmin) {
      throw Error('You are not an administrator');
    }

    return userAdmin;
  }

  public async findAll(company, userId) {
    const allUsers = await this.userRepository.findAll(company);

    const colaborators = allUsers.filter(res => {
      const userIdConverted = res._id.toString();

      if (userIdConverted !== userId) {
        return res;
      }
    });

    return colaborators;
  }

  public async find(id: string) {
    return await this.userRepository.findById(id);
  }

  public async findEmployeeByName(name, adminCompanyId) {
    return await this.userRepository.findEmployeeByName(name, adminCompanyId);
  }

  public async create(user: IUser, adminCompanyId) {
    const userExists = await this.userRepository.findByEmailOrCpf(user.email, user.cpf);

    if (userExists) {
      throw Error('This user already exists');
    }

    const newPassword = await encrypt(user.password);

    user.company = adminCompanyId;
    user.password = newPassword;

    await this.userRepository.save(user);
  }

  public async update(id: string, isAdmin: boolean) {
    if (isAdmin === undefined) {
      throw Error('There is missing data')
    }

    await this.userRepository.adminUpdateUser(id, isAdmin);
  }

  public async remove(id: string) {
    await this.userRepository.remove(id);
  }
}
