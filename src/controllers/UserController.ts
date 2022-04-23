import { Request, Response } from 'express';

import UserRepository from '../repositories/UserRepository';
import CompanyRepository from '../repositories/CompanyRepository';

import UserService from '../services/UserService';

class UserController {
    userRepository: UserRepository;
    companyRepository: CompanyRepository;
    service: UserService;

    constructor() {
        this.userRepository = new UserRepository();
        this.companyRepository = new CompanyRepository();
        this.service = new UserService(this.userRepository, this.companyRepository);
    }

    public async userInfo(req: Request, res: Response): Promise<Response> {
        try {
            const user = await this.service.find(req.userId);

            return res.status(200).json({ user: user });
        } catch {
            return res.status(500).json({ msg: 'Something unexpected happened' });
        }
    }

    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const { name, email, password, confirmPassword, cpf, cellphone, companyName, cnpj } = req.body;

            const company = { name: companyName, cnpj: cnpj };
            const user = { name, email, password, cpf, cellphone, isAdmin: true };

            await this.service.create(company, user, confirmPassword);

            return res.status(201).json({ msg: 'User and company created successfully' });
        } catch (err) {
            return res.status(400).json({ msg: err.message });
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        try {
            const { name, email, password, cpf, cellphone } = req.body;

            const user = { name, email, password, cpf, cellphone };

            await this.service.update(req.userId, user);

            return res.status(200).json({ msg: 'User updated successfully' });
        } catch (err) {
            return res.status(400).json({ msg: err.message });
        }
    }

    public async forgotPassword(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = req.body;

            await this.service.forgotPassword(email);

            return res.status(200).json({ msg: 'Email sended successfully' });
        } catch (err) {
            return res.status(404).json({ msg: err.message });
        }
    }

}

export default new UserController();