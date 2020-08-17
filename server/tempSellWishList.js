const { query } = require("../db_config");
// const { createStringifyObj } = require("./helpers");

const insertData = async ({
  customerId,
  productId,
  colorId,
  sizeId,
  quantity,
  table_name,
}) => {
  // const { customerId, productId, sizeId, colorId, quantity } = params;
  return await query(
    `INSERT INTO ${table_name} (customerId, productId, colorId, sizeId, quantity) VALUES (${customerId}, ${productId}, ${colorId} , ${sizeId}, ${quantity})`
  );
};

const readData = async ({
  customerId,
  productId,
  colorId,
  sizeId,
  table_name,
}) => {
  return await query(`SELECT * FROM ${table_name} 
  WHERE customerId=${customerId} AND productId=${productId} 
  AND colorId=${colorId} AND sizeId=${sizeId} AND status='initial'`);
};

const updateData = async (id, quantity, table_name) => {
  return await query(`UPDATE ${table_name}
                      SET quantity = ${quantity}
                      WHERE id=${id}`);
};

const deleteData = async (id, table_name) =>
  await query(`DELETE FROM ${table_name} WHERE id=${id}`);

module.exports = { insertData, updateData, readData, deleteData };
