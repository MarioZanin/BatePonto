import nodemailer from 'nodemailer';
import { ICompany } from '../interfaces/ICompany';
import { IUser } from '../interfaces/IUser';
import compare from '../providers/passwordCompareProvider';
import encrypt from '../providers/passwordProvider';
import CompanyRepository from '../repositories/CompanyRepository';
import UserRepository from '../repositories/UserRepository';
import crypto from 'crypto';

export default class UserService {
  private userRepository: UserRepository;
  private companyRepository: CompanyRepository | undefined;

  constructor(
    userRepository: UserRepository,
    CompanyRepository?: CompanyRepository
  ) {
    this.userRepository = userRepository;
    CompanyRepository ? this.companyRepository = CompanyRepository : this.companyRepository = undefined;
  }

  public async find(id: string) {
    return await this.userRepository.findById(id);
  }

  public async authValidate(email: string, password: string) {
    const user = await this.userRepository.findByEmailOrCpf(email);

    if (!user) {
      throw Error('User not found!');
    }

    if (!password) {
      throw Error('Password was not provided!');
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      throw Error('Credentials does not match');
    }

    return user;
  }

  public async create(company: ICompany, user: IUser, confirmPassword: string) {
    if (user.password !== confirmPassword) {
      throw Error('Passwords are not equals');
    }

    if (this.companyRepository) {
      let newCompany = await this.companyRepository.findByCnpj(company.cnpj);

      if (newCompany) {
        throw Error('This company already exists in our records');
      }

      const userExists = await this.userRepository.findByEmailOrCpf(user.email, user.cpf);

      if (userExists) {
        throw Error('This user already exists in our records');
      }

      newCompany = await this.companyRepository.save(company)

      user.company = newCompany._id;

      const newPassword = await encrypt(user.password);

      user.password = newPassword;

      await this.userRepository.save(user);
    }
  }

  public async update(id: string, {
    name,
    email,
    password,
    cpf,
    cellphone
  }) {
    if (!name && !email && !password && !cpf && !cellphone) {
      throw Error('You did not pass any value to change');
    }

    if (!password) {
      await this.userRepository.update(id,
        {
          name,
          email,
          password,
          cpf,
          cellphone
        });
    } else {
      const newPassword = await encrypt(password);
      await this.userRepository.update(id,
        {
          name,
          email,
          password: newPassword,
          cpf,
          cellphone
        });
    }
  }

  public async updatePassword(id: string, password: string) {
    const newPassword = await encrypt(password);
    await this.userRepository.updatePassword(id, newPassword);
  }

  public async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmailOrCpf(email);

    if (!user) {
      throw Error('User was not found');
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const newPassword = crypto.randomBytes(4).toString('hex');

    await transporter.sendMail({
      from: `Bate Ponto <${process.env.MAIL_USER}>`,
      subject: 'Bate&Ponto - Recuperação de Senha',
      to: [email],
      html: `
        <html>
          <body>
              <h1>Bate&Ponto</h1>
              <p>Olá <b>${user.name}</b>, recebemos o seu pedido de mudança de senha, sua senha passou a ser <b>${newPassword}</b>.</p>
              <p>Caso não tenha sido você que fez esse pedido, entre em contato conosco.</p>
              <span>Por favor, não responda esse email.</span>
          <body/>
        </html>
      `
    }).then(() => {
      this.updatePassword(user._id.toString(), newPassword);
    });
  }
}
