const { query } = require("../db_config");

module.exports.getCategoriesByVendorId = async id => {
  return await query(`
    SELECT
        DISTINCT (p.category_id),
        c.category_name
    FROM
        products p 
    JOIN
        category c         
            on p.category_id = c.id 
    WHERE
        p.vendor_id = ${id} 
        AND c.status='active' 
        AND c.softDel=0
  `);
};

module.exports.getProductsByCatIdAndVenId = async (catId, venId) => {
  return await query(`
  SELECT
      id AS product_id,
      slug,
      product_name,
      product_sku,
      home_image,
      image,
      productPrice,
      vendor_id,
      category_id,
      DATEDIFF(CURRENT_TIMESTAMP,
      created_date) <= 15 AS newProduct
  FROM
      products
  WHERE
      category_id=${catId}
      AND vendor_id = ${venId} 
      AND softDelete=0
      AND isApprove='authorize'
      AND status='active'
  `);
};

// module.exports = { getCategoriesByVendorId };
