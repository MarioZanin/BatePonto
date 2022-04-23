import { Schema, Model, model } from 'mongoose';
import { ICompany } from '../interfaces/ICompany';

const CompanySchema = new Schema<ICompany>({
    name: { type: String, required: true },
    cnpj: { type: String, required: true }
}, {
    timestamps: true
});
  
export const Company: Model<ICompany> = model<ICompany>('Company', CompanySchema);