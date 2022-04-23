import { Request, Response } from 'express';
import UserRepository from '../repositories/UserRepository';
import AdminService from '../services/AdminService';


class AdminController {
    userRepository: UserRepository;
    service: AdminService;

    constructor() {
        this.userRepository = new UserRepository();
        this.service = new AdminService(this.userRepository);
    }

    public async getUserById(req: Request, res: Response): Promise<Response> {
        try {
            await this.service.verifyAdminPermission(req.userId);

            const colaborator = await this.service.find(req.params.id);

            return res.status(200).json({ user: colaborator });
        } catch {
            return res.status(500).json({ msg: 'Something unexpected happened' });
        }
    }

    public async listUsers(req: Request, res: Response): Promise<Response> {
        try {
            const user = await this.service.verifyAdminPermission(req.userId);

            const users = await this.service.findAll(user.company, req.userId);

            return res.status(200).json({ users: users });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

    public async getUserByName(req: Request, res: Response): Promise<Response> {
        try {
            const user = await this.service.verifyAdminPermission(req.userId);

            const { name } = req.query;

            const users = await this.service.findEmployeeByName(name, user.company);

            return res.status(200).json({ users });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

    public async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const user = await this.service.verifyAdminPermission(req.userId);

            const { name, email, password, cpf, cellphone, isAdmin } = req.body;

            const newUser = { name, email, password, cpf, cellphone, isAdmin };

            await this.service.create(newUser, user.company);

            return res.status(201).json({ msg: 'User created sucessfully' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

    public async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            await this.service.verifyAdminPermission(req.userId);

            const { isAdmin } = req.body;

            await this.service.update(req.params.id, isAdmin);

            return res.status(200).json({ msg: 'User updated successfully' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }

    public async removeUser(req: Request, res: Response): Promise<Response> {
        try {
            await this.service.verifyAdminPermission(req.userId);

            await this.service.remove(req.params.id);

            return res.status(200).json({ msg: 'User removed successfully' });
        } catch (err) {
            return res.status(500).json({ msg: 'Something unexpected happened' });
        }
    }
}

export default new AdminController();