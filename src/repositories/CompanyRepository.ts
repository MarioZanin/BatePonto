import { ICompany } from '../interfaces/ICompany';
import { Company } from '../schemas/Company';

export default class CompanyRepository {

    public async findById(id: string) {
        return await Company.findOne({ _id: id });
    }

    public async findByCnpj(cnpj: string) {
        return await Company.findOne({ cnpj: cnpj });
    }

    public async update(id: string, company: ICompany) {
        return await Company.findOneAndUpdate({ id }, company);
    }

    public async remove(id: string) {
        return await Company.findOneAndRemove({ _id: id });
    }

    public async save(company: ICompany) {
        return await Company.create(company);
    }
}