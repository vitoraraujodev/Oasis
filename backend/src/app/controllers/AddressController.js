import * as Yup from 'yup';
import Company from '../models/Company';
import Address from '../models/Address';

class AddressController {
  async index(req, res) {
    const address = await Address.findOne({
      where: { company_id: req.companyId },
      attributes: [
        'id',
        'cep',
        'city',
        'neighborhood',
        'municipality',
        'street',
        'number',
        'complement',
      ],
    });

    return res.json(address);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      cep: Yup.string().required(),
      city: Yup.string().required(),
      neighborhood: Yup.string().required(),
      municipality: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const companyExists = await Company.findByPk(req.companyId);

    if (!companyExists) {
      return res
        .status(400)
        .json({ error: 'Essa empresa não está registrada' });
    }

    const addressExists = await Address.findOne({
      where: { company_id: req.companyId },
    });

    if (addressExists) {
      return res
        .status(400)
        .json({ error: 'Essa empresa já possui um endereço registrado.' });
    }

    const {
      id,
      cep,
      city,
      neighborhood,
      municipality,
      street,
      number,
      complement,
    } = await Address.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      cep,
      city,
      neighborhood,
      municipality,
      street,
      number,
      complement,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      cep: Yup.string(),
      city: Yup.string(),
      neighborhood: Yup.string(),
      municipality: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json({ error: 'Empresa não existe.' });
    }

    const address = await Address.findOne({
      where: { company_id: req.companyId },
    });

    const {
      id,
      cep,
      city,
      neighborhood,
      municipality,
      street,
      number,
      complement,
    } = await address.update(req.body);

    return res.json({
      id,
      cep,
      city,
      neighborhood,
      municipality,
      street,
      number,
      complement,
    });
  }
}

export default new AddressController();
