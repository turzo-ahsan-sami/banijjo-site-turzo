const { query } = require("../db_config");

const db_tables_plus = ["sales_return_details", "inv_purchase_details"];
const db_tables_minus = [
  "sales_details",
  "inv_purchase_return_details",
  "product_damage"
];

const _calculateTotalAmount = async params => {
  const { db_tables, productId, colorId, sizeId } = params;
  let total_amount = 0;
  let flag = true;

  for (const tables of db_tables) {
    let amount = 0;
    for (const tbl of tables) {
      const query_str = `SELECT productId, colorId, sizeId, sum(quantity) as total_quantity FROM ${tbl}
                          WHERE productId=${productId} AND sizeId=${sizeId} AND colorId=${colorId} AND status=1 AND softDel=0
                          GROUP BY productId, colorId, sizeId `;
      const data = await query(query_str);
      amount += data.length ? data[0].total_quantity : 0;
    }
    if (flag) {
      total_amount += amount;
      flag = false;
    } else total_amount -= amount;
  }

  return total_amount < 0 ? 0 : total_amount;
};

const checkInventory = async (req, res) => {
  let total_amount = 0;

  const db_tables = [db_tables_plus, db_tables_minus];

  let { productId, colorId, sizeId } = req.body;
  productId = !!productId ? productId : 0;
  colorId = !!colorId ? colorId : 0;
  sizeId = !!sizeId ? sizeId : 0;

  if (!productId)
    return res.json({ msg: "A productId is required", total_amount });

  try {
    total_amount = await _calculateTotalAmount(
      db_tables,
      productId,
      colorId,
      sizeId
    );
    return res.json({ total_amount });
  } catch (e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
};

const checkInventoryFunc = async (productId, colorId, sizeId) => {
  productId = !!productId ? productId : 0;
  colorId = !!colorId ? colorId : 0;
  sizeId = !!sizeId ? sizeId : 0;

  if (!productId) return 0;

  const db_tables = [db_tables_plus, db_tables_minus];
  const params = { db_tables, productId, colorId, sizeId };

  try {
    return await _calculateTotalAmount({ ...params });
  } catch (e) {
    return 0;
  }
};

const checkProductAvailability = async productId => {
  const db_tables = [...db_tables_plus, ...db_tables_minus];
  for (const dbTable of db_tables) {
    const query_str = `SELECT count(*) as num_of_rows FROM ${dbTable}
                        WHERE productId=${productId} AND status=1 AND softDel=0`;
    try {
      const data = await query(query_str);

      const { num_of_rows } = data[0];
      if (num_of_rows > 0) return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  return false;
};

const netProductsFromStock = async (productId, colorId, sizeId) => {
  productId = !!productId ? productId : 0;
  colorId = !!colorId ? colorId : 0;
  sizeId = !!sizeId ? sizeId : 0;
  
  if (!productId) return 0;

  const query_str = `
    SELECT 
      productId, 
      colorId, 
      sizeId, 
      sum(quantity) as total_quantity 
    FROM 
      stock
    WHERE 
      productId=${productId} AND 
      sizeId=${sizeId} AND 
      colorId=${colorId} 
      AND status=1 
      AND softDel=0
    GROUP BY 
      productId, 
      colorId, 
      sizeId
    `;

  try {
    const data = await query(query_str);
    return data.length
      ? data[0].total_quantity > 0
        ? data[0].total_quantity
        : 0
      : 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

const insertIntoStock = async (
  productId,
  colorId,
  sizeId,
  quantity,
  vendorId,
  createdBy
) => {
  return await query(`
    INSERT
    INTO
      stock
      (productId, colorId, sizeId, quantity, vendorId, createdBy)
     VALUES
      (${productId},${colorId},${sizeId},${quantity},${vendorId},${createdBy})
  `);
};



const getProductStockQuantity = async (productId = 0, colorId = 0, sizeId = 0) => {
  const query_str = `SELECT productId, colorId, sizeId, sum(quantity) as total_quantity FROM stock
  WHERE productId=${productId} AND sizeId=${sizeId} AND colorId=${colorId} AND status=1 AND softDel=0
  GROUP BY productId, colorId, sizeId`;
  const data = await query(query_str);
  return data.length ? data[0].total_quantity : 0;
}

module.exports = {
  checkInventory,
  checkInventoryFunc,
  checkProductAvailability,
  netProductsFromStock,
  insertIntoStock,
  getProductStockQuantity
};
