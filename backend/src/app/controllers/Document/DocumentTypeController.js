import * as Yup from 'yup';
import Company from '../../models/Company';
import DocumentType from '../../models/Document/DocumentType';

class DocumentTypeController {
  async index(req, res) {
    const companyExists = await Company.findByPk(req.companyId);

    if (!companyExists) {
      return res
        .status(400)
        .json({ error: 'Essa empresa não está registrada' });
    }

    const documentType = await DocumentType.findOne({
      where: { company_id: req.companyId },
    });

    return res.json(documentType);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      document_type: Yup.string().required(),
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

    const documentType = await DocumentType.findOne({
      where: { company_id: req.companyId },
    });

    if (documentType) {
      const { id, document_type } = await documentType.update(req.body);

      return res.json({
        id,
        document_type,
      });
    }

    const { id, document_type } = await DocumentType.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      document_type,
    });
  }
}

export default new DocumentTypeController();
