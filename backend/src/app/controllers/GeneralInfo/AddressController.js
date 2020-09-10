import * as Yup from 'yup';
import Company from '../../models/Company';
import Address from '../../models/GeneralInfo/Address';

class AddressController {
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

    const address = await Address.findOne({
      where: { company_id: req.companyId },
    });

    if (address) {
      const {
        id,
        cep,
        city,
        neighborhood,
        municipality,
        street,
        number,
        complement,
      } = await address.update({
        ...req.body,
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
}

export default new AddressController();
