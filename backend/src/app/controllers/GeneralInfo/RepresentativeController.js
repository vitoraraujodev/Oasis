import * as Yup from 'yup';
import Company from '../../models/Company';
import Representative from '../../models/GeneralInfo/Representative';

class RepresentativeController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      cpf: Yup.string().required(),
      email: Yup.string().email().required(),
      phone_number: Yup.string().required(),
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

    const representative = await Representative.findByPk(req.body.id);

    if (representative) {
      const {
        id,
        name,
        email,
        cpf,
        phone_number,
      } = await representative.update(req.body);

      return res.json({
        id,
        name,
        email,
        cpf,
        phone_number,
      });
    }

    const { id, name, email, cpf, phone_number } = await Representative.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      name,
      email,
      cpf,
      phone_number,
    });
  }

  async delete(req, res) {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json('Empresa não encontrada.');
    }

    const representative = await Representative.findByPk(req.params.id);

    if (!representative)
      return res.status(400).json('Esse representante não está registrado.');

    if (representative.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar esse representante.');
    }

    await representative.destroy();

    return res.json({ okay: true });
  }
}

export default new RepresentativeController();
