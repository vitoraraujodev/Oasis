import * as Yup from 'yup';
import Company from '../../models/Company';
import Product from '../../models/ProductiveProcess/Product';
import ProductStorage from '../../models/ProductiveProcess/ProductStorage';

class ProductController {
  async store(req, res) {
    const schema = Yup.object().shape({
      identification: Yup.string().required(),
      physical_state: Yup.string().required(),
      quantity: Yup.number().required(),
      capacity: Yup.number().required(),
      unit: Yup.string().required(),
      transport: Yup.string().required(),
      packaging: Yup.string().required(),
      storages: Yup.array().of(
        Yup.object().shape({
          id: Yup.number(),
          location: Yup.string().required(),
          identification: Yup.string().required(),
          amount: Yup.number().min(1).required(),
          capacity: Yup.number().required(),
          unit: Yup.string().required(),
        })
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const companyExists = await Company.findByPk(req.companyId);

    if (!companyExists) {
      return res.status(400).json({
        error: 'Essa Empresa não está registrada.',
      });
    }

    const product = await Product.findByPk(req.body.id);

    const { storages } = req.body;

    if (storages.length === 0) {
      return res.status(400).json({
        error: 'Por favor, informe o sistema de armazenamento.',
      });
    }

    if (!product) {
      // Creates new Product
      await Product.create({
        ...req.body,
        company_id: req.companyId,
      })
        .then(async (result) => {
          // Creates all Product's Storages
          if (storages.length > 0) {
            const newStorages = storages.map((storage) => ({
              ...storage,
              product_id: result.id,
            }));

            await ProductStorage.bulkCreate(newStorages);
          }
          return result;
        })
        .then(async (result) =>
          // Find Product with all it's Storages
          Product.findByPk(result.id, {
            order: [['identification', 'ASC']],
            attributes: [
              'id',
              'identification',
              'physical_state',
              'quantity',
              'capacity',
              'unit',
              'transport',
              'packaging',
            ],
            include: [
              {
                model: ProductStorage,
                as: 'storages',
                order: [['identification', 'ASC']],
                attributes: [
                  'id',
                  'location',
                  'identification',
                  'amount',
                  'capacity',
                  'unit',
                ],
              },
            ],
          })
        )
        .then((result) => res.json(result));
    } else {
      const productStorages = await ProductStorage.findAll({
        where: { product_id: product.id },
      });
      // If Product already exists, updates it
      await product
        .update({
          ...req.body,
        })
        .then(async (result) => {
          // Creates/update all Product's Storages
          if (storages.length > 0) {
            const newStorages = storages.map((storage) => ({
              ...storage,
              product_id: result.id,
            }));
            await ProductStorage.bulkCreate(newStorages, {
              updateOnDuplicate: [
                'location',
                'identification',
                'amount',
                'capacity',
                'unit',
              ],
            });
          }
          return result;
        })
        .then(async (result) => {
          // Delete Product's Storages
          const deleteStorages = productStorages.filter(
            (productStorage) =>
              !storages.find((storage) => storage.id === productStorage.id)
          );
          if (deleteStorages.length > 0)
            await ProductStorage.destroy({
              where: { id: deleteStorages.map((storage) => storage.id) },
            });
          return result;
        })
        .then(async (result) =>
          // Find Product with all it's Storages
          Product.findByPk(result.id, {
            order: [['identification', 'ASC']],
            attributes: [
              'id',
              'identification',
              'physical_state',
              'quantity',
              'capacity',
              'unit',
              'transport',
              'packaging',
            ],
            include: [
              {
                model: ProductStorage,
                as: 'storages',
                order: [
                  ['location', 'ASC'],
                  ['identification', 'ASC'],
                ],
                attributes: [
                  'id',
                  'location',
                  'identification',
                  'amount',
                  'capacity',
                  'unit',
                ],
              },
            ],
          })
        )
        .then((result) => res.json(result));
    }
  }

  async delete(req, res) {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json('Empresa não encontrada.');
    }

    const product = await Product.findByPk(req.params.id);

    if (!product)
      return res.status(400).json('Esse produto não está registrado.');

    if (product.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar esse produto.');
    }

    await product.destroy();

    return res.json({ okay: true });
  }
}

export default new ProductController();
