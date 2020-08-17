const { query } = require("../db_config");
const { sampleSize } = require("lodash");

const getRandomChildArr = async (children, threshold) => {
  let filtered_firstChildren = [];

  try {
    for (const { id } of children) {
      const data = await query(
        `SELECT COUNT(*) as no_of_children FROM category WHERE parent_category_id=${id}`
      );

      const { no_of_children } = data[0];

      filtered_firstChildren =
        no_of_children > threshold - 1
          ? [...filtered_firstChildren, { id, no_of_children }]
          : [...filtered_firstChildren];
    }

    return filtered_firstChildren.length > threshold
      ? sampleSize(filtered_firstChildren, threshold)
      : filtered_firstChildren;
  } catch (e) {
    return e;
  }
};

const add_discount_to_productArr = (discountArr, products) => {
  let product_details = [];
  for (const product of products) {
    const discountAmount = getDiscountByProductId(
      discountArr,
      product.product_id
    );
    product_details = [...product_details, { ...product, discountAmount }];
  }
  return product_details;
};

const getRandomProductArr = async (children, threshold) => {
  let productArr = [];
  try {
    const discountArr = await getDiscountArr();
    for (const { id, slug, category_name, parent_category_id } of children) {
      const data = await query(`SELECT COUNT(*) as no_of_products FROM products WHERE category_id=${id} AND 
                               softDelete=0 AND isApprove='authorize' AND status='active'`);
      const { no_of_products } = data[0];

      if (no_of_products > threshold - 2) {
        let products = await getProductsByCategoryId(id);
        products =
          products.length > threshold
            ? sampleSize(products, threshold)
            : products;

        const cat_info = { id, slug, category_name, parent_category_id };

        if (products.length) {
          products = add_discount_to_productArr(discountArr, products);
          productArr = [...productArr, { cat_info, products }];
        }
      }
    }
    return productArr;
  } catch (e) {
    return e;
  }
};

const getChildrenFromCategory = async (cat_id) => {
  try {
    return await query(
      `SELECT * FROM category WHERE parent_category_id=${cat_id} AND status='active'`
    );
  } catch (e) {
    return e;
  }
};

const getCategoryInfoById = async (cat_id) => {
  return await query(
    `SELECT id, slug, category_name, parent_category_id 
      FROM category 
      WHERE id=${cat_id} AND status='active'`
  );
};

const getProductsFromParent = async (id) => {
  return await query(
    `SELECT id, slug, category_name, parent_category_id 
     FROM category
     WHERE parent_category_id IN
      (SELECT id FROM category WHERE parent_category_id = ${id} AND status='active')`
  );
};

const getProductsFromChild = async (id) => {
  return await query(
    `SELECT id, slug, category_name, parent_category_id
     FROM category
     WHERE parent_category_id=${id} AND status='active'`
  );
};

/*const getProductsByCategoryId = async cat_id => {
  return await query(
    `SELECT *, DATEDIFF(CURRENT_TIMESTAMP, created_date) <= 15 AS newProduct
     FROM products
     WHERE category_id=${cat_id} AND status='active' 
     AND isApprove='authorize' AND softDelete=0`
  );
};*/

const getProductsByCategoryId = async (cat_id) => {
  try {
    return await query(
      `SELECT id as product_id, 
        slug,
        product_name, 
        productPrice, 
        home_image, 
        image,
        DATEDIFF(CURRENT_TIMESTAMP, created_date) <= 15 AS newProduct
       FROM 
        products
       WHERE 
        category_id=${cat_id} 
        AND status='active' 
        AND isApprove='authorize' 
        AND softDelete=0`
    );
  } catch (e) {
    return e;
  }
};

const getDiscountArr = async () =>
  await query(`
    SELECT 
      product_id 
    FROM 
      discount 
    WHERE 
      softDel=0 AND 
      status='active' AND 
      curdate() between effective_from and effective_to
  `);

const getCategoryWiseProductList = async (leafChildrenArr, cat_id) => {
  let resArr = [];

  const discountArr = await getDiscountArr();

  for (const { id, parent_category_id } of leafChildrenArr) {
    let breadcrumbs = [];
    let productList = [];
    const arr =
      cat_id !== `${parent_category_id}`
        ? [cat_id, parent_category_id, id]
        : [cat_id, id];

    const products = await getProductsByCategoryId(id);
    for (const product of products) {
      const discountAmount = getDiscountByProductId(discountArr, product.id);
      const productWithDiscount = { ...product, discountAmount };
      productList = [...productList, productWithDiscount];
    }

    if (products.length) {
      for (const arrElement of arr) {
        breadcrumbs = [
          ...breadcrumbs,
          ...(await getCategoryInfoById(arrElement)),
        ];
      }
    }
    resArr = [...resArr, { breadcrumbs, products: productList }];
  }
  return resArr.filter(({ products }) => products.length);
};

const showProductListByCategory = async (cat_id) => {
  // clicked on parent category
  const parent = await getProductsFromParent(cat_id);
  if (parent.length) {
    return await getCategoryWiseProductList(parent, cat_id);
  }

  // clicked on child category
  const children = await getProductsFromChild(cat_id);
  if (children.length) {
    return await getCategoryWiseProductList(children, cat_id);
  }

  // click on leaf child
  let resArr = [];
  let productList = [];
  const discountArr = await getDiscountArr();

  const products = await getProductsByCategoryId(cat_id);
  const breadcrumbs = await getCategoryInfoById(cat_id);

  for (const product of products) {
    const discountAmount = getDiscountByProductId(
      discountArr,
      product.product_id
    );
    const productWithDiscount = { ...product, discountAmount };
    productList = [...productList, productWithDiscount];
  }
  resArr = [...resArr, { breadcrumbs, products: productList }];
  return resArr.filter(({ products }) => products.length);
};

// get Discount By ProductId
const getDiscountByProductId = (discountArr, product_id) => {
  let discountAmount = 0;

  for (const item of discountArr) {
    const itemArr = JSON.parse(item["product_id"]);
    itemArr.forEach(({ id, discount }) => {
      if (id === `${product_id}`) discountAmount += parseInt(discount);
    });
  }

  return discountAmount;
};

const createStringifyObj = (params) => {
  let stringifyObj = {};

  Object.entries(params).forEach(([key, value]) => {
    stringifyObj[key] = JSON.stringify(value);
  });

  return stringifyObj;
};

const getProductsFromTempsellOrWishlist = async (cartData) => {
  let cartProducts = [];

  for (const el of cartData) {
    const cartProduct = await query(`
          SELECT 
            id, slug, product_name, productPrice, home_image, image 
          FROM 
            products 
          WHERE 
            id=${el.productId}
        `);

    const color = await query(`
          SELECT
              id, name as colorName 
          FROM
              color_infos 
          WHERE
              id=${el.colorId}
        `);
    const size = await query(`
          SELECT
              id, size 
          FROM
              size_infos 
          WHERE
              id=${el.sizeId}
        `);

    cartProduct[0].color = color[0];
    cartProduct[0].size = size[0];
    cartProduct[0].quantity = el.quantity;

    cartProducts = [...cartProducts, ...cartProduct];
  }
  return cartProducts;
};

module.exports = {
  getChildrenFromCategory,
  getRandomProductArr,
  getRandomChildArr,
  showProductListByCategory,
  getCategoryInfoById,
  getDiscountByProductId,
  getDiscountArr,
  createStringifyObj,
  getProductsFromTempsellOrWishlist,
};
