import * as Yup from 'yup';
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
      return res.status(400).json({
        error:
          'Falha na validação dos dados. Por favor, verifique e tente novamente.',
      });
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
