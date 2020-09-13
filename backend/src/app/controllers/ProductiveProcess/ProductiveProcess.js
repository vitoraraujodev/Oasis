import Equipment from '../../models/ProductiveProcess/Equipment';
import Product from '../../models/ProductiveProcess/Product';
import ProductStorage from '../../models/ProductiveProcess/ProductStorage';
import Supply from '../../models/ProductiveProcess/Supply';
import SupplyStorage from '../../models/ProductiveProcess/SupplyStorage';

class ProductiveProcessController {
  async index(req, res) {
    const equipments = await Equipment.findAll({
      where: { company_id: req.companyId },
      order: [['identification', 'DESC']],
      attributes: [
        'id',
        'kind',
        'identification',
        'amount',
        'date',
        'capacity',
        'capacity_unit',
        'fuel',
        'consumption',
        'parameter',
        'value',
        'value_unit',
      ],
    });

    const products = await Product.findAll({
      order: [['identification', 'DESC']],
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
          order: [['identification', 'DESC']],
          attributes: ['id', 'identification', 'amount', 'capacity', 'unit'],
        },
      ],
    });

    const supplies = await Supply.findAll({
      order: [['identification', 'DESC']],
      attributes: [
        'id',
        'identification',
        'physical_state',
        'quantity',
        'unit',
        'transport',
        'packaging',
      ],
      include: [
        {
          model: SupplyStorage,
          as: 'storages',
          order: [['identification', 'DESC']],
          attributes: ['id', 'identification', 'amount', 'capacity', 'unit'],
        },
      ],
    });

    return res.json({ equipments, products, supplies });
  }
}

export default new ProductiveProcessController();
