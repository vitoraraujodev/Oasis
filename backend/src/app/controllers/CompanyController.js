import Company from '../models/Company';

class CompanyController {
  async store(req, res) {
    const companyExists = await Company.findOne({
      where: { email: req.body.email },
    });

    if (companyExists) {
      return res.status(400).json({ errer: 'Esse e-mail já está em uso' });
    }

    const { id, name, email, typology, status } = await Company.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      typology,
      status,
    });
  }
}

export default new CompanyController();
