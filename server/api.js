const express = require("express");
const fetch = require("node-fetch");
const scuid = require("scuid");
const slugify = require("slugify");
const urlSlug = require("url-slug");
const { sampleSize, size } = require("lodash");
const auth = require("./authFunctionality");
const temp_wish = require("./tempSellWishList");
const featureProductHelper = require("./feature_product_list_helper");
const vendor = require("./vendorHelper");
const nodemailer = require("nodemailer");

// const upload_path = `${__dirname}/../../upload/customerPhoto/`;
const upload_path = `${__dirname}/../../banijjoAdmin/public/upload/customerPhoto/`;

const {
  checkInventoryFunc,
  checkProductAvailability,
  netProductsFromStock,
  insertIntoStock,
  getProductStockQuantity,
} = require("./checkInventory");

const {
  getChildrenFromCategory,
  getRandomChildArr,
  getRandomProductArr,
  showProductListByCategory,
  getDiscountByProductId,
  getDiscountArr,
  getProductsFromTempsellOrWishlist,
} = require("./helpers");

const { query } = require("../db_config");

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const { search_text, search_query, orderway, limit, offset } = req.query;

    let db_products = await query(`SELECT * FROM products`);

    if (search_text)
      db_products = db_products.filter(
        (product) =>
          product.product_name
            .toLowerCase()
            .indexOf(search_text.toLowerCase()) !== -1
      );
    if (orderway)
      orderway == "desc"
        ? db_products.sort((a, b) => b.product_name - a.product_name)
        : db_products.sort((a, b) => a.product_name - b.product_name);
    if (offset) db_products = db_products.slice(offset);
    if (limit) db_products = db_products.slice(0, limit);

    let products = [];
    db_products.length > 0 &&
      db_products.forEach((element) => {
        products.push({
          product_name: element.product_name,
          product_price: element.productPrice,
          product_url: `http://localhost:3000/product-details/${element.id}`,
          product_image: `https://localhost:3000/${element.home_image}`,
        });
      });

    return res.send({ products });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await query("SELECT * FROM category");
    return res.send({ error: false, data: categories, message: "users list." });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Server Error");
  }
});

router.get("/feature_name", async (req, res) => {
  const feature_name = await query("SELECT * FROM feature_name");

  return res.send(feature_name);
});

router.get("/company_info", async (req, res) => {
  const company_infos = await query(`
    SELECT 
      id, name, logo, url 
    FROM 
      org_info
  `);
  let result = {};

  for (const companyInfo of company_infos) {
    if (companyInfo.name === "banijjo-com")
      result = { ...result, banijjo: companyInfo };
  }
});

router.get("/top_main_banners", async (req, res) => {
  try {
    const mainBanners = await query(
      `SELECT id, name, image, url FROM banner WHERE softDel=0 AND status=1 order by rand() limit 5`
    );
    res.json({ data: mainBanners });
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});

router.get("/feature_product_list", async (req, res) => {
  try {
    let feature_names = await query(`
      SELECT 
        id AS feature_id,
        name AS title,
        code
      FROM 
        feature_name
      WHERE 
        status=1 AND softDel=0 ORDER BY code
    `);

    feature_names = feature_names.filter(({ code }) => code !== 0);

    const discountArr = await getDiscountArr();

    let result = [];

    for (const { feature_id, title, code } of feature_names) {
      const products = await featureProductHelper.getFeatureProductsInfo(
        feature_id,
        discountArr
      );

      result = [...result, { [code]: { feature_id, title, code, products } }];
    }

    res.json({ results: size(result), data: result });
  } catch (e) {
    console.error(e);
    res.json(e);
  }
});

router.get("/getDiscountByProductId/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;
    const discountArr = await query(
      `select product_id from discount where softDel=0 and status='active' and curdate() between effective_from and effective_to`
    );

    const discountAmount = getDiscountByProductId(discountArr, product_id);

    res.json({ discountAmount });
  } catch (e) {
    console.error(e.message);
    res.send("Server Error");
  }
});

router.get("/productDetails/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const data = await query(
      `SELECT * FROM products WHERE id=${productId} AND softDelete=0 AND isApprove='authorize' AND status='active'`
    );

    const productDetails = { ...data[0] };

    const {
      product_specification_name,
      image,
      metaTags,
      product_full_description,
      product_specification_details_description,
    } = productDetails;

    const product_specification = JSON.parse(product_specification_name);

    // colors array
    if (product_specification.hasOwnProperty("color")) {
      const { color } = product_specification;
      productDetails.colors = await Promise.all(
        color.map(async (item) => {
          const data = await query(
            `SELECT id, name FROM color_infos WHERE id=${item.colorId} AND softDel=0 AND status=1`
          );
          return { ...item, colorName: data[0].name, selected: false };
        })
      );
    } else {
      productDetails.colors = [];
    }

    // size array
    if (product_specification.hasOwnProperty("size")) {
      const { size } = product_specification;
      productDetails.sizes = await Promise.all(
        size.map(async (id) => {
          const data = await query(
            `SELECT id, size, size_type_id FROM size_infos WHERE id=${id} AND softDel=0 AND status=1`
          );
          return { ...data[0] };
        })
      );
    } else {
      productDetails.sizes = [];
    }

    // Carousel Images
    const imageArr = JSON.parse(image);
    productDetails.carouselImages = imageArr.length ? imageArr : null;

    //metaTags
    productDetails.metaTags = !!metaTags ? JSON.parse(metaTags) : null;

    // product_full_description
    const product_description = JSON.parse(product_full_description);
    productDetails.description = product_description.length
      ? product_description
      : null;

    // product_specification_details_description
    const specificationDetailsDescription = JSON.parse(
      product_specification_details_description
    );
    productDetails.specificationDetailsDescription = specificationDetailsDescription.length
      ? specificationDetailsDescription
      : null;

    /*// product List of Similar Vendor-Other Category
    productDetails.productSmVendor = await query(
      `SELECT id, product_name, product_sku, home_image, productPrice FROM products
      WHERE vendor_id=${vendor_id} AND category_id <> ${category_id} AND
      id <> ${id} AND softDelete=0 AND isApprove='authorize' AND status='active' ORDER BY RAND() LIMIT 6`
    );

    // product List of Similar Category-Other Vendor
    productDetails.productSmCategory = await query(
      `SELECT id, product_name, product_sku, home_image, productPrice FROM products
       WHERE category_id=${category_id} AND vendor_id <> ${vendor_id} AND
       id <> ${id} AND softDelete=0 AND isApprove='authorize' AND status='active' ORDER BY RAND() LIMIT 6`
    );*/

    // delete productDetails.product_specification_id;
    // delete productDetails.product_specification_details;
    // delete productDetails.product_specification_details_description;
    // delete productDetails.product_full_description;
    // delete productDetails.product_specification_name;
    // delete productDetails.image;

    return res.json(productDetails);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

// product List of Similar Vendor-Other Category
router.get("/sameVendorOrCat/:productId/:venOrCat", async (req, res) => {
  const { productId, venOrCat } = req.params;

  try {
    const data = await query(`
      SELECT 
        id, slug, category_id, vendor_id 
      FROM 
        products 
      WHERE 
        id=${productId} AND softDelete=0 AND isApprove='authorize' AND status='active'
    `);

    const { id, vendor_id, category_id } = data[0];
    const discountArr = await getDiscountArr();
    let products = [];

    if (venOrCat === "v") {
      // product List of Similar Vendor-Other Category
      products = await query(`
        SELECT 
          id AS product_id, slug, product_name, product_sku, home_image, image,
          productPrice, vendor_id, category_id, DATEDIFF(CURRENT_TIMESTAMP, created_date) <= 15 AS newProduct
        FROM 
          products 
        WHERE 
          vendor_id=${vendor_id} AND 
          category_id <> ${category_id} AND 
          id <> ${id} AND 
          softDelete=0 AND 
          isApprove='authorize' AND 
          status='active'
      `);
    } else if (venOrCat === "c") {
      products = await query(`
        SELECT 
          id AS product_id, slug, product_name, product_sku, home_image, image,
          productPrice, vendor_id, category_id, DATEDIFF(CURRENT_TIMESTAMP, created_date) <= 15 AS newProduct
        FROM 
          products 
        WHERE 
          category_id=${category_id} AND 
          vendor_id <> ${vendor_id} AND 
          id <> ${id} AND 
          softDelete=0 AND isApprove='authorize' AND status='active'
      `);
    }

    let result = [];

    if (products.length > 0) {
      for (const product of products) {
        const discountAmount = getDiscountByProductId(discountArr, product.id);
        result = [...result, { ...product, discountAmount }];
      }
    }

    res.json({ results: result.length, sameVendorOrCat: result });
  } catch (e) {
    console.error(e);
    res.json({ error: e });
  }
});

var lastChildsAll = [];

router.get("/sidebar_category", async (req, res) => {
  try {
    const categories = await query(
      `Select * FROM category_order WHERE status=1`
    );

    return res.send({
      error: false,
      data: categories,
      message: "all category list.",
    });
  } catch (e) {
    console.error(e);
  }
});

router.get("/child_categories", async (req, res) => {
  try {
    let c_id = req.query.id;

    let category_ids = [c_id];
    let categoryArray = [];

    let categoryObj = {};
    var lastChildsObjects = [];

    const subCategoriesList = await query(
      `SELECT * FROM category where parent_category_id=${c_id}`
    );

    for (const j in subCategoriesList) {
      let lastObj = {};
      category_ids = [...category_ids, subCategoriesList[j].id];

      // var childArray = findoutChildsOfSub(subCategoriesList[j].id,allCategories);
      var childArray = await query(
        "SELECT * FROM category where parent_category_id=" +
          subCategoriesList[j].id +
          ""
      );

      for (const k in childArray)
        category_ids = [...category_ids, childArray[k].id];

      lastObj.category = subCategoriesList[j];
      lastObj.lastChilds = childArray;
      lastChildsObjects.push(lastObj);
    }

    let vendor_ids = [];

    for (const c_id in category_ids) {
      const v_ids = await query(
        `select distinct vendor_id from products where category_id = ${category_ids[c_id]}`
      );

      vendor_ids = [...vendor_ids, ...v_ids];
    }

    const distinct_vendor_ids = [
      ...new Set(vendor_ids.map((x) => x.vendor_id)),
    ];
    let vendor_images = [];

    for (const id of distinct_vendor_ids) {
      const v_image = await query(
        `select vendor_id, shop_name, slug, logo from vendor_details where vendor_id=${id}`
      );

      vendor_images = [...vendor_images, ...v_image];
    }

    categoryObj.subcategories = lastChildsObjects;
    categoryObj.vendorImages = vendor_images;
    categoryArray.push(categoryObj);

    return res.send({
      error: false,
      data: categoryArray,
      message: "all category list.",
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

router.get("/all_category_list", async (req, res) => {
  var categories = await query(`
  SELECT 
    category.id, category.slug, category.category_name,category_order.status 
  FROM 
    category_order LEFT JOIN category ON category_order.category_id = category.id
  `);

  var categoryArray = [];
  let vendor_images = [];
  if (categories.length > 0) {
    lastChildsAll.length = 0;
    for (const i in categories) {
      let category_ids = [];
      category_ids = [...category_ids, categories[i].id];
      let categoryObj = {};
      var lastChildsObjects = [];
      const subCategoriesList = await query(
        "SELECT * FROM category where parent_category_id=" +
          categories[i].id +
          ""
      );

      for (const j in subCategoriesList) {
        let lastObj = {};
        category_ids = [...category_ids, subCategoriesList[j].id];

        // var childArray = findoutChildsOfSub(subCategoriesList[j].id,allCategories);
        var childArray = await query(
          "SELECT * FROM category where parent_category_id=" +
            subCategoriesList[j].id +
            ""
        );

        for (const k in childArray)
          category_ids = [...category_ids, childArray[k].id];

        lastObj.category = subCategoriesList[j];
        lastObj.lastChilds = childArray;
        lastChildsObjects.push(lastObj);
      }
      let vendor_ids = [];

      for (const c_id in category_ids) {
        const v_ids = await query(
          `select distinct vendor_id from products where category_id = ${category_ids[c_id]}`
        );
        vendor_ids = [...vendor_ids, ...v_ids];
      }

      const distinct_vendor_ids = [
        ...new Set(vendor_ids.map((x) => x.vendor_id)),
      ];

      let vendor_images = [];

      for (const id of distinct_vendor_ids) {
        const v_image = await query(
          `select vendor_id, slug, shop_name, logo from vendor_details where vendor_id=${id}`
        );
        vendor_images = [...vendor_images, ...v_image];
      }

      categoryObj.category = categories[i];
      categoryObj.subcategories = lastChildsObjects;
      categoryObj.vendorImages = vendor_images;
      categoryArray.push(categoryObj);
    }
  }
  return res.send({
    results: categoryArray.length,
    data: categoryArray,
  });
});

router.get("/all_category_list_more", async (req, res) => {
  var categories = await query(
    "SELECT * FROM category where parent_category_id=0"
  );

  var categoryArray = [];
  if (categories.length > 0) {
    lastChildsAll.length = 0;
    for (const i in categories) {
      let categoryObj = {};
      var lastChildsObjects = [];
      const subCategoriesList = await query(
        "SELECT * FROM category where parent_category_id=" +
          categories[i].id +
          ""
      );
      for (const j in subCategoriesList) {
        let lastObj = {};

        // var childArray = findoutChildsOfSub(subCategoriesList[j].id,allCategories);
        var childArray = await query(
          "SELECT * FROM category where parent_category_id=" +
            subCategoriesList[j].id +
            ""
        );
        lastObj.category = subCategoriesList[j];
        lastObj.lastChilds = childArray;
        lastChildsObjects.push(lastObj);
      }
      categoryObj.category = categories[i];
      categoryObj.subcategories = lastChildsObjects;
      categoryArray.push(categoryObj);
    }
  }

  return res.send({
    error: false,
    data: categoryArray,
    message: "all category list.",
  });
});

// new api
// router.post("/checkInventory", async (req, res) => {
//   try {
//     const cartData = req.body.cartProducts;
//     for (const i in cartData) {
//       const purchaseDetialsQuantity = await query(
//         "SELECT sum(inv_purchase_details.quantity) as quantity FROM inv_purchase_details WHERE productId = '" +
//           cartData[i].id +
//           "'"
//       );
//       const purchaseReturnQuantity = await query(
//         "SELECT sum(inv_purchase_return_details.quantity) as quantity FROM inv_purchase_return_details WHERE productId = '" +
//           cartData[i].id +
//           "'"
//       );
//       const salesDetailsQuantity = await query(
//         "SELECT sum(sales_details.sales_product_quantity) as quantity FROM sales_details WHERE product_id = '" +
//           cartData[i].id +
//           "'"
//       );
//       const salesReturnQuantity = await query(
//         "SELECT sum(sales_return_details.salesReturnQuantity) as quantity FROM sales_return_details WHERE productId = '" +
//           cartData[i].id +
//           "'"
//       );
//       const itemInventory =
//         purchaseDetialsQuantity[0].quantity -
//         purchaseReturnQuantity[0].quantity -
//         salesDetailsQuantity[0].quantity +
//         salesReturnQuantity[0].quantity;
//
//       if (itemInventory > 0) {
//         if (itemInventory < cartData[i].quantity) {
//           return res.status(200).send({
//             error: false,
//             data: false,
//             message: "Item not in Inventory!"
//           });
//         }
//       } else {
//         return res.status(200).send({
//           error: false,
//           data: false,
//           message: "Item not in Inventory!"
//         });
//       }
//     }
//     return res.status(200).send({ error: false, data: true, message: "Ok!" });
//   } catch (error) {
//     return res
//       .status(404)
//       .send({ error: true, data: false, message: error.message });
//   }
// });

// new api
router.get("/getVendorImages", async (req, res) => {
  const vendorImages = await query(
    "SELECT vendor_id, slug, shop_name, logo from vendor_details WHERE softDel=0 AND status=1"
  );
  return res.send({ error: false, data: vendorImages, message: "Ok!" });
});

// Get request to fetch top navbar category
router.get("/getTopNavbarCategory", async (req, res) => {
  const categories = await query(
    "SELECT * from category_top_navbar WHERE status=1"
  );
  return res.send({ result: categories.length, data: categories });
});

// edited by sojib vai
router.post("/payOrder", async (req, res) => {
  const { discountAmount } = req.body;
  const { discountDetail } = req.body;
  let { promoCodeAmount } = req.body;
  const { promoCodeDetail } = req.body;
  const { customerId } = req.body;

  try {
    const tempSells = await query(`
      SELECT 
        ts.id as tempId, 
        ts.customerId, 
        ts.productId, 
        ts.colorId, 
        ts.sizeId, 
        ts.quantity, 
        p.productPrice, 
        p.vendor_id as vendorId
      FROM 
        temp_sell ts JOIN products p ON ts.productId = p.id
      WHERE 
        ts.customerId = ${customerId} AND ts.status='initial'
    `);

    let totalQuantity = 0;
    let totalPrice = 0;

    // may not be needed already calculated in frontend
    for (const tempSellItem of tempSells) {
      totalQuantity = totalQuantity + tempSellItem.quantity;
      totalPrice =
        totalPrice + tempSellItem.productPrice * tempSellItem.quantity;
    }

    // can be calculated using data send from cart
    var finalPrice = totalPrice - discountAmount - promoCodeAmount;

    // calculation for bill generate
    var date = new Date();
    var year = date.getFullYear();
    var todayDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    // Ask sajib vai.
    String.prototype.lpad = function (padString, length) {
      var str = this;
      while (str.length < length) str = padString + str;
      return str;
    };

    const saleRecord = await query(`
      SELECT
        sales_bill_no
      FROM
        sales
      WHERE
        createdDate BETWEEN CONCAT(YEAR(CURDATE()),'-01-01') AND CONCAT(YEAR(CURDATE())+1,'-12-31')
      ORDER BY
        id desc LIMIT 1;
    `);

    if (saleRecord.length > 0) {
      var saleRecordBillNo = saleRecord[0].sales_bill_no;
      var splitBillNo = saleRecordBillNo.split("-");
      var billPaddingInt = parseInt(splitBillNo[2]) + 1;
      var newBillPadding = billPaddingInt.toString().lpad("0", 7);
      var newBillNo = "BNJ-" + year + "-" + newBillPadding;
    } else {
      var newBillPadding = "1".lpad("0", 7);
      var newBillNo = "BNJ-" + year + "-" + newBillPadding;
    }

    const insertSell = await query(
      "insert into sales(sales_bill_no,sales_type,customer_id,sales_date,total_sales_quantity,total_sales_amount,discount_amount,promo_code,netAmount) VALUES('" +
        newBillNo +
        "','cash','" +
        customerId +
        "','" +
        todayDate +
        "','" +
        totalQuantity +
        "','" +
        totalPrice +
        "','" +
        discountAmount +
        "','" +
        JSON.stringify(promoCodeDetail) +
        "','" +
        finalPrice +
        "')"
    );

    const salesId = insertSell.insertId;

    await query(
      "insert into product_payment(customer_id,order_id,payment_amount,payment_method) VALUES('" +
        customerId +
        "','" +
        salesId +
        "','" +
        finalPrice +
        "','cash')"
    );

    for (const tempSellItem of tempSells) {
      let totalAmount = tempSellItem.quantity * tempSellItem.productPrice;

      var discountAmount2 = 0;
      for (const j in discountDetail) {
        if (tempSellItem.productId === discountDetail[j].productId) {
          discountAmount2 =
            discountAmount2 + discountDetail[j].amount * tempSellItem.quantity;
        }
      }

      var customerPayableAmount = totalAmount - discountAmount2;

      const itemInventory = await netProductsFromStock(
        tempSellItem.productId,
        tempSellItem.colorId,
        tempSellItem.sizeId
      );

      if (itemInventory > tempSellItem.quantity) {
        const insertData = await query(
          "insert into sales_details(customerId,salesBillId,productId,colorId, sizeId, sales_product_quantity,unitPrice,total_amount,customer_payable_amount,discounts_amount) VALUES('" +
            customerId +
            "','" +
            salesId +
            "','" +
            tempSellItem.productId +
            "','" +
            tempSellItem.colorId +
            "','" +
            tempSellItem.sizeId +
            "','" +
            tempSellItem.quantity +
            "','" +
            tempSellItem.productPrice +
            "','" +
            totalAmount +
            "','" +
            customerPayableAmount +
            "','" +
            discountAmount2 +
            "')"
        );

        // insert into stock table
        const insertData2 = await insertIntoStock(
          tempSellItem.productId,
          tempSellItem.colorId,
          tempSellItem.sizeId,
          -tempSellItem.quantity,
          tempSellItem.vendorId,
          customerId
        );

        // delete from temp_sell table
        await temp_wish.deleteData(tempSellItem.tempId, "temp_sell");
        /*const data = await temp_wish.readData({
          customerId,
          productId: tempSellItem.productId,
          colorId: tempSellItem.colorId,
          sizeId: tempSellItem.sizeId,
          table_name: "temp_sell"
        });
        if (data.length > 0)
          await temp_wish.deleteData(data[0].id, "temp_sell");*/
      } else {
        throw Error("Item Not in Inventory");
      }
    }

    return res.status(200).send({
      error: false,
      data: true,
      message: "Nice! Your Order Has been placed Successfully",
    });
  } catch (error) {
    return res
      .status(404)
      .send({ error: true, data: false, message: error.message });
  }
});

const url1 = "http://ecomservice.banijjo.com.bd/api";
const url2 = "microservice.banijjo.com.bd/api";

// new api
router.post("/paySsl", async (req, res) => {
  fetch(`${url1}/ssl`, {
    method: "POST",
    crossDomain: true,
    headers: {
      Accept: "routerlication/json",
      "Content-Type": "routerlication/json",
    },
    body: JSON.stringify({
      customerId: req.body.customerId,
      discountAmount: req.body.discountAmount,
      discountDetail: req.body.discountDetail,
      promoCodeAmount: req.body.promoCodeAmount,
      promoCodeDetail: req.body.promoCodeDetail,
      purchaseType: "",
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return res.send({ error: false, data: data, message: "Api Successfull" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// new api
router.post("/getDiscounts", async (req, res) => {
  const discounts = await query(
    "SELECT * FROM discount WHERE effective_from <= NOW() AND effective_to >= NOW() AND softDel=0 AND status='active'"
  );

  const cartProducts = req.body.cartProducts;

  const cartIds = [];
  const cartProductQty = [];
  if (req.body.customerId) {
    for (let i in cartProducts) {
      cartIds.push(parseInt(cartProducts[i].id));
      cartProductQty.push({
        productId: cartProducts[i].id,
        quantity: cartProducts[i].quantity,
      });
    }
  } else {
    for (let i in cartProducts) {
      cartIds.push(parseInt(cartProducts[i].productId));
      cartProductQty.push({
        productId: cartProducts[i].productId,
        quantity: cartProducts[i].quantity,
      });
    }
  }

  var discountAmount = 0;
  const discountDetail = [];
  for (let i in discounts) {
    const parsedArr = JSON.parse(discounts[i].product_id);

    for (let j in parsedArr) {
      var specific = parseInt(parsedArr[j].id);
      if (cartIds.includes(specific) === true) {
        for (const k in cartProductQty) {
          if (cartProductQty[k].productId == specific) {
            discountAmount =
              discountAmount +
              parseInt(parsedArr[j].discount) * cartProductQty[k].quantity;
          }
        }
        discountDetail.push({
          id: discounts[i].id,
          productId: specific,
          amount: parseInt(parsedArr[j].discount),
        });
      }
    }
  }

  return res.send({
    error: false,
    data: discountAmount,
    dataDetail: discountDetail,
    message: "Yes",
  });
});

// new api
router.post("/getPromoCodeAmount", async (req, res) => {
  let promoCodeInput = req.body.promoCodeInput;
  let totalAmount = req.body.totalAmount;
  let customerId = req.body.customerId;

  const promo = await query(
    "SELECT * FROM promocode WHERE promo_code='" +
      promoCodeInput +
      "' AND effective_from <= NOW() AND effective_to >= NOW() AND softDel=0 AND status=1"
  );
  const customerSalesData = await query(
    "select promo_code from sales where customer_id='" + customerId + "'"
  );

  let consumedPromoAmount = 0;
  let usedTimes = 0;
  if (customerSalesData.length > 0) {
    for (let i in customerSalesData) {
      const promoCodeArr = JSON.parse(customerSalesData[i].promo_code);
      for (let j in promoCodeArr) {
        if (promoCodeInput === promoCodeArr[j].code) {
          consumedPromoAmount =
            consumedPromoAmount + parseInt(promoCodeArr[j].amount);
          usedTimes++;
        }
      }
    }
  }

  const promoDetail = [];
  let promoCodeAmount = 0;
  for (let i in promo) {
    let invoice_amount = promo[i].invoice_amount;
    let promo_amount = promo[i].promo_amount;
    let promo_percantage = promo[i].promo_percantage;
    let isMultiple = promo[i].isMultiple;
    let valueAfterPercentageCalculation =
      (promo_percantage / 100) * totalAmount;

    if (valueAfterPercentageCalculation > promo_amount) {
      var routerlicableAmount = promo_amount;
    } else {
      var routerlicableAmount = valueAfterPercentageCalculation;
    }

    if (consumedPromoAmount < invoice_amount) {
      if (consumedPromoAmount > 0) {
        if (isMultiple === "yes") {
          if (promo[i].times > usedTimes) {
            promoCodeAmount = promoCodeAmount + routerlicableAmount;
          } else {
            promoCodeAmount = promoCodeAmount;
          }
        } else {
          promoCodeAmount = promoCodeAmount;
        }
      } else {
        promoCodeAmount = promoCodeAmount + routerlicableAmount;
      }
    }
  }
  promoDetail.push({ code: promoCodeInput, amount: promoCodeAmount });
  return res.send({
    error: false,
    data: promoCodeAmount,
    dataDetail: promoDetail,
    message: "Yes",
  });
});

// temp sell
router.post("/tempsell", async (req, res) => {
  try {
    // const { customerId, productId, colorId, sizeId, quantity } = req.body;

    const data = await tempSell.insertIntoTempSell(req.body);

    res.json(data);
  } catch (e) {
    console.log(e);
  }
});

// revised api
// customer login
router.post("/loginCustomerInitial", async (req, res) => {
  try {
    const { email, password } = req.body;

    const loginCustomer = await auth.login({ email, password });

    if (loginCustomer.length > 0) {
      return res.send({
        error: false,
        data: loginCustomer[0].id,
        message: "Login Successful",
      });
    } else {
      return res.send({
        error: true,
        data: null,
        message: "Invalid Credentials",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// revised api
// /register customer
router.post("/saveCustomerInitial", async (req, res) => {
  const { email, password, cartData } = req.body;
  try {
    const emailExists = await auth.emailExists({ email });
    if (emailExists.length > 0) {
      return res.json({
        error: true,
        data: null,
        message: "Email Already Exists!",
      });
    }
    const insertCustomer = await auth.register({ email, password });
    // return res.json(insertCustomer);

    if (insertCustomer.affectedRows > 0) {
      // const cartData = req.body.cartData;
      if (cartData && cartData.length > 0) {
        for (const cartDatum of cartData) {
          const { productId, colorId, sizeId, quantity } = cartDatum;
          await temp_wish.insertData({
            customerId: insertCustomer.insertId,
            productId,
            colorId,
            sizeId,
            quantity,
            table_name: "temp_sell",
          });
        }
      }
      return res.json({
        error: false,
        data: insertCustomer.insertId,
        message: "success",
      });
    }
    return res.json({
      error: false,
      data: insertCustomer.insertId,
      message: "success",
    });
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});

router.post("/socialLogin", async (req, res) => {
  const { name, email, id } = req.body;
  console.log({ name, email, id });

  try {
    const userInfo = await auth.socialIdExists({ id });

    if (userInfo.length === 0) {
      const customer_id = await auth.socialRegister({ name, email, id });
      return res.json({ customer_id: customer_id.insertId });
    }

    return res.json({ customer_id: userInfo[0].id });
  } catch (e) {
    res.send({ e });
  }
});

// for testing purpose
router.post("/readtempdata", async (req, res) => {
  const data = await temp_wish.readData(req.body);
  return res.json({ data });
});

router.post("/updatetempdata", async (req, res) => {
  const { id, quantity, table_name } = req.body;
  const data = await temp_wish.updateData(id, quantity, table_name);
  return res.json({ data });
});

router.post("/inserttempdata", async (req, res) => {
  // const { id, quantity, table_name } = req.body;
  const data = await temp_wish.insertData(req.body);
  return res.json({ data });
});

router.post("/deletetempdata", async (req, res) => {
  const { id, table_name } = req.body;
  const data = await temp_wish.deleteData(id, table_name);
  return res.json({ data });
});

router.post("/add_cart_direct", async (req, res) => {
  const { buttonClick } = req.body;
  // let table_name = "";
  // if (tableName === "cart") table_name = "temp_sell";
  // else if (tableName === "wish") table_name = "wish_list";

  try {
    if (buttonClick === "cart") req.body.table_name = "temp_sell";
    else if (buttonClick === "wish") req.body.table_name = "wish_list";

    const checkIfExist = await temp_wish.readData(req.body);

    if (checkIfExist.length > 0) {
      const data = await temp_wish.updateData(
        checkIfExist[0].id,
        req.body.quantity,
        req.body.table_name
      );
      if (data.affectedRows > 0)
        return res.send({
          error: false,
          data: true,
          message: "updated successful",
        });
      return res.send({
        error: false,
        data: false,
        message: "updated unsuccessful",
      });
    }

    const data = await temp_wish.insertData(req.body);
    if (data.affectedRows > 0)
      return res.send({
        error: false,
        data: true,
        message: "inserted successful",
      });
    return res.send({
      error: false,
      data: false,
      message: "inserted unsuccessful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
  /*const checkIfExist = await query(
    "select * from temp_sell where item_ids='" +
      req.body.productId +
      "' and customer_id='" +
      req.body.customerId +
      "'"
  );
  if (checkIfExist.length > 0) {
    await query(
      "UPDATE temp_sell SET quantity= quantity+1 WHERE customer_id = '" +
        req.body.customerId +
        "' and item_ids='" +
        req.body.productId +
        "'"
    );
  } else {
    await query(
      "INSERT INTO temp_sell (customer_id, item_ids,quantity) VALUES ('" +
        req.body.customerId +
        "', '" +
        req.body.productId +
        "','" +
        req.body.quantity +
        "')"
    );
  }
  return res.send({ error: false, data: true, message: "success" });*/
});

router.post("/add_wish_direct", async (req, res) => {
  const checkIfExist = await query(
    "select * from wish_list where item_ids='" +
      req.body.productId +
      "' and customer_id='" +
      req.body.customerId +
      "'"
  );
  if (checkIfExist.length > 0) {
    await query(
      "UPDATE wish_list SET quantity= quantity+1 WHERE customer_id = '" +
        req.body.customerId +
        "' and item_ids='" +
        req.body.productId +
        "'"
    );
  } else {
    await query(
      "INSERT INTO wish_list (customer_id, item_ids, quantity) VALUES ('" +
        req.body.customerId +
        "', '" +
        req.body.productId +
        "','" +
        req.body.quantity +
        "')"
    );
  }
  return res.send({ error: false, data: true, message: "success" });
});

// new api
router.post("/add_cart_direct_from_wish", async (req, res) => {
  try {
    const checkIfExist = await temp_wish.readData(req.body);

    if (checkIfExist.length > 0) {
      const data = await temp_wish.updateData(
        checkIfExist[0].id,
        req.body.quantity,
        req.body.table_name
      );
      if (data.affectedRows > 0)
        return res.send({
          error: false,
          data: true,
          message: "updated successful",
        });
      return res.send({
        error: false,
        data: false,
        message: "updated unsuccessful",
      });
    }

    const data = await temp_wish.insertData(req.body);
    if (data.affectedRows > 0)
      return res.send({
        error: false,
        data: true,
        message: "inserted successful",
      });
    return res.send({
      error: false,
      data: false,
      message: "inserted unsuccessful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Server Error");
  }
  /*const checkIfExist = await query(
    "select * from temp_sell where item_ids='" +
      req.body.productId +
      "' and customer_id='" +
      req.body.customerId +
      "'"
  );
  if (checkIfExist.length > 0) {
    const updateProductTemp = await query(
      "UPDATE temp_sell SET quantity= quantity+'" +
        req.body.quantity +
        "' WHERE customer_id = '" +
        req.body.customerId +
        "' and item_ids='" +
        req.body.productId +
        "'"
    );
  } else {
    const insertProductsTemp = await query(
      "INSERT INTO temp_sell (customer_id, item_ids,quantity) VALUES ('" +
        req.body.customerId +
        "', '" +
        req.body.productId +
        "','" +
        req.body.quantity +
        "')"
    );
  }
  return res.send({ error: false, data: true, message: "success" });*/
});

/*router.post("/saveCustomerAddress", async (req, res) => {
  let updateCustomerShipping = await query(
    "UPDATE customer SET name='" +
      req.body.name +
      "',phone_number='" +
      req.body.phone_number +
      "',address='" +
      req.body.address +
      "',city='" +
      req.body.city +
      "',district='" +
      req.body.district +
      "' WHERE id = '" +
      req.body.customerId +
      "'"
  );
  if (updateCustomerShipping) {
    return res.send({ error: false, data: true, message: "success" });
  }
});*/



// bangladesh-geocode

router.get("/getCityList", async (req, res) => {
  try {
    const districts = await query(`
      SELECT district 
      FROM bangladesh_geocode
      GROUP BY district
    `);
    res.json(districts);
  } catch (e) {
    res.send(e);
  }
});

router.get("/getThanaList/:district", async (req, res) => {
  const { district } = req.params;
  try {
    const thanas = await query(`
      SELECT thana 
      FROM bangladesh_geocode
      WHERE district = '${district}'
      GROUP BY thana           
    `);
    res.json(thanas);
  } catch (e) {
    res.send(e);
  }
});

router.get("/getAreaList/:thana", async (req, res) => {
  const { thana } = req.params;
  try {
    const areas = await query(`
      SELECT postoffice 
      FROM bangladesh_geocode
      WHERE thana = '${thana}'
      GROUP BY postoffice           
    `);
    res.json(areas);
  } catch (e) {
    res.send(e);
  }
});

router.get("/getPostCode/:area", async (req, res) => {
  const { area } = req.params;
  try {
    const postcode = await query(`
      SELECT postcode 
      FROM bangladesh_geocode
      WHERE postoffice = '${area}'
      GROUP BY postcode           
    `);
    res.json(postcode);
  } catch (e) {
    res.send(e);
  }
});

router.post("/saveCustomerAddress", async (req, res) => {
  console.log(req.body);
  const {
    customerId,
    name,
    address,
    phone_number,
    email,
    customerCity,
    customerThana,
    customerArea,
    customerDistrict,
    customerPostCode,
  } = req.body;

  try {
    await query(`
      UPDATE
        customers_address
      SET
        name = ${JSON.stringify(name)},
        address = ${JSON.stringify(address)},
        phone_number = ${JSON.stringify(phone_number)},
        email = ${JSON.stringify(email)},
        city = ${JSON.stringify(customerCity)},
        thana = ${JSON.stringify(customerThana)},
        area = ${JSON.stringify(customerArea)},
        district = ${JSON.stringify(customerDistrict)},
        zipcode = ${JSON.stringify(customerPostCode)}
      WHERE
        id = ${customerId};
    `);
    res.json({ error: false, msg: "Update Successful" });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      error: true,
      message: e.sqlMessage,
    });
  }
});

// router.post("/saveCustomerAddress", async (req, res) => {
//   console.log(req.body);
//   const {
//     customerId,
//     name,
//     address,
//     phone_number,
//     city_id,
//     district_id,
//     area_id,
//   } = req.body;

//   try {
//     await query(`
//       UPDATE
//         customer
//       SET
//         name = ${JSON.stringify(name)},
//         address = ${JSON.stringify(address)},
//         phone_number = ${JSON.stringify(phone_number)},
//         city_id = ${JSON.stringify(city_id)},
//         area_id = ${JSON.stringify(area_id)},
//         district_id = ${JSON.stringify(district_id)}
//       WHERE
//         id = ${customerId} AND status = 'active';
//     `);
//     res.json({ error: false, msg: "Update Successful" });
//   } catch (e) {
//     console.error(e);
//     res.status(500).send({
//       error: true,
//       message: e.sqlMessage,
//     });
//   }
// });

router.get("/getCustomerAddress/:customer_id", async (req, res) => {
  try {
    const customerAddress = await query(`
      SELECT
        name,
        address,
        phone_number,
        city_id,
        district_id,
        area_id
      FROM
        customer
      WHERE
        id = ${req.params.customer_id} AND status = 'active'
    `);
    // console.log(customerAddress[0].name);
    res.json({
      error: false,
      customerAddress: customerAddress[0],
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      error: true,
      data: e.sqlMessage,
    });
  }
});

router.post("/getCustomerCartProducts", async (req, res) => {
  try {
    let { customerId, cartData } = req.body;

    let cartProducts = [];

    if (customerId === 0) {
      cartProducts = await getProductsFromTempsellOrWishlist(cartData);
    } else {
      cartData = await query(
        `SELECT 
            productId, colorId, sizeId, status, quantity 
        FROM
            temp_sell 
        WHERE
            customerId = ${customerId} AND status = 'initial'`
      );

      if (cartData.length > 0)
        cartProducts = await getProductsFromTempsellOrWishlist(cartData);
    }
    return res.json({ cartProducts });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

// new api
router.post("/getCustomerWishProducts", async (req, res) => {
  try {
    let { customerId, wishListData } = req.body;

    let wishProducts = [];

    if (customerId === 0) {
      wishProducts = await getProductsFromTempsellOrWishlist(wishListData);
    } else {
      wishListData = await query(
        `SELECT 
            productId, colorId, sizeId, status, quantity 
        FROM
            wish_list 
        WHERE
            customerId = ${customerId} AND status = 'initial'`
      );
      if (wishListData.length > 0)
        wishProducts = await getProductsFromTempsellOrWishlist(wishListData);
    }
    return res.json({ wishProducts });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

// new api
router.post("/updateCustomerCartProducts", async (req, res) => {
  try {
    const { customerId, cartProductsInfo, table_name } = req.body;

    for (const cartEl of cartProductsInfo) {
      const { id, color, size, quantity } = cartEl;
      const data = await temp_wish.readData({
        customerId,
        productId: id,
        colorId: color.id,
        sizeId: size.id,
        table_name,
      });

      await temp_wish.updateData(data[0].id, quantity, table_name);
    }
    return res.json({
      data: true,
      message: "updateCustomerCartProducts successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.sqlMessage);
  }

  /*if (req.body.type == 0) {
    await query(
      "UPDATE temp_sell SET quantity=quantity-1 WHERE quantity>0 AND customer_id='" +
        req.body.customerId +
        "' AND item_ids='" +
        req.body.itemId +
        "'"
    );
  } else {
    await query(
      "UPDATE temp_sell SET quantity=quantity+1 WHERE customer_id='" +
        req.body.customerId +
        "' AND item_ids='" +
        req.body.itemId +
        "'"
    );
  }*/
  // return res.send({ error: false, message: "Customer cart product updated." });
});

// new api
router.post("/updateCustomerWishProducts", async (req, res) => {
  try {
    const { customerId, wishProductsInfo, table_name } = req.body;

    for (const wishEl of wishProductsInfo) {
      const { id, color, size, quantity } = wishEl;
      const data = await temp_wish.readData({
        customerId,
        productId: id,
        colorId: color.id,
        sizeId: size.id,
        table_name,
      });

      await temp_wish.updateData(data[0].id, quantity, table_name);
    }
    return res.json({
      data: true,
      message: "updateCustomerCartProducts successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e.sqlMessage);
  }

  /*if (req.body.type === 0) {
    await query(
      "UPDATE wish_list SET quantity=quantity-1 WHERE quantity>0 AND customer_id='" +
        req.body.customerId +
        "' AND item_ids='" +
        req.body.itemId +
        "'"
    );
  } else {
    await query(
      "UPDATE wish_list SET quantity=quantity+1 WHERE customer_id='" +
        req.body.customerId +
        "' AND item_ids='" +
        req.body.itemId +
        "'"
    );
  }
  return res.send({ error: false, message: "Customer wish product updated." });*/
});

// new api
router.post("/deleteCustomerCartProducts", async (req, res) => {
  try {
    const {
      customerId,
      cartProductInfo: { id, color, size },
      table_name,
    } = req.body;

    const data = await temp_wish.readData({
      customerId,
      productId: id,
      colorId: color.id,
      sizeId: size.id,
      table_name,
    });

    await temp_wish.deleteData(data[0].id, table_name);

    return res.json({
      data: true,
      message: "deleteCustomerCartProducts successful",
    });
    /*for (const cartEl of cartProductsInfo) {
      const { id, color, size } = cartEl;
      const data = await temp_wish.readData({
        customerId,
        productId: id,
        colorId: color.id,
        sizeId: size.id,
        table_name
      });

      await temp_wish.deleteData(data[0].id, table_name);
    }*/
  } catch (e) {
    console.log(e);
    res.status(500).send(e.sqlMessage);
  }
  /*await query(
    "DELETE FROM temp_sell WHERE customer_id='" +
      req.body.customerId +
      "' AND item_ids='" +
      req.body.itemId +
      "'"
  );
  return res.send({ error: false, message: "Customer cart product deleted." });*/
});

// new api
router.post("/deleteCustomerWishProducts", async (req, res) => {
  await query(
    "DELETE FROM wish_list WHERE customer_id='" +
      req.body.customerId +
      "' AND item_ids='" +
      req.body.itemId +
      "'"
  );
  return res.send({ error: false, message: "Customer wish product deleted." });
});

// @route   POST api/getVendorData
// @desc    Get vendor details from vendor_details
router.post("/getVendorData", async (req, res) => {
  const vendorData = await query(
    "SELECT name, slug, shop_name, logo, cover_photo from vendor_details WHERE vendor_id = '" +
      req.body.vendorId +
      "'"
  );

  return res.send({
    error: false,
    data: vendorData[0],
    message: "Vendor Info",
  });
});

router.get("/vendorInfoById/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await query(`
      SELECT
          id,
          slug,
          name,
          shop_name,
          vendor_id,
          logo,
          cover_photo
      FROM
          vendor_details 
      WHERE
          vendor_id = ${id} 
          AND status = 1 
          AND softDel = 0
    `);

    res.json({
      vendorInfo: data[0],
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

router.get("/categoriesByVendorId/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await vendor.getCategoriesByVendorId(id);

    res.json({
      length: data.length,
      result: data,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get("/getVendorProductsByCategory/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await vendor.getCategoriesByVendorId(id);
    const discountArr = await getDiscountArr();

    let result = [];

    for (const cat of categories) {
      let products = [];
      let productsInfo = await vendor.getProductsByCatIdAndVenId(
        cat.category_id,
        id
      );

      for (const product of productsInfo) {
        const discountAmount = getDiscountByProductId(
          discountArr,
          product.product_id
        );
        products = [...products, { ...product, discountAmount }];
      }

      result = [
        ...result,
        {
          categoryName: cat.category_name,
          categoryId: cat.category_id,
          products,
        },
      ];
    }

    res.json({ length: result.length, result });
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
});

// new api
router.post("/getVendorProductsByCategory", async (req, res) => {
  try {
    const { vendorId, categoryIds } = req.body;

    const ProductData = await query(
      "SELECT id,category_id,product_name,productPrice,home_image, image,created_date from products WHERE status='active' AND softDelete=0 AND vendor_id = '" +
        vendorId +
        "' AND category_id IN " +
        "(" +
        categoryIds +
        ")" +
        ""
    );
    return res.send({ data: ProductData });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

// new api
router.get("/get_advertisement", async (req, res) => {
  try {
    const advertData = await query(
      "SELECT id, name, image from advertisement WHERE status=1 AND softDel=0"
    );
    return res.json({
      error: false,
      data: advertData[0],
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

router.get("/getCustomerCartProductsCount/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;

    const cartData = await query(
      `SELECT SUM(quantity) quantity FROM temp_sell WHERE customerId = ${customer_id}  GROUP BY customerId`
    );
    return res.send({
      error: false,
      data: cartData[0].quantity,
      message: "customer cart product list.",
    });
  } catch (e) {
    res.send(e);
  }
});
router.get("/getCustomerCartInfo/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;

    const cartData = await query(
      `SELECT productId, colorId, sizeId, quantity FROM temp_sell WHERE customerId = ${customer_id}`
    );
    return res.send(cartData);
  } catch (e) {
    res.send(e);
  }
});

router.get("/all_category_product_list", async (req, res) => {
  try {
    const productLists = await query(`select category.slug, category.category_name, products.id, products.slug, products.product_name, products.home_image, products.image, products.category_id, products.productPrice
from category join products on category.id = products.category_id
where products.qc_status='yes' and products.status='active' and products.isApprove=1 and products.softDelete=0;`);
    return res.send({
      error: false,
      data: productLists,
      message: "all category product list.",
    });
  } catch (e) {
    console.log("Error occured at the of fetching data from product table");
    console.log(e);

    return res.send({
      error: true,
      data: [],
      message: "Error.....",
    });
  }
});

// api created by mehedi
router.get("/category_product_list/:cat_id", async (req, res) => {
  try {
    var parentId = req.params.cat_id;

    const productLists = await query(
      "SELECT * FROM products WHERE category_id = " +
        parentId +
        " AND softDelete = 0 AND status = 1"
    );

    return res.send({
      error: false,
      data: productLists,
      message: "all category product list.",
    });
  } catch (e) {
    console.log("Error occured at the of fetching data from product table");
    console.log(e);

    return res.send({
      error: true,
      data: [],
      message: "Error.....",
    });
  }
});

router.get("/get_terms_conditions", async (req, res) => {
  const termsCOnditions = await query("SELECT * FROM terms_conditions");
  return res.send({
    error: false,
    data: termsCOnditions[0].terms_and_conditions,
    message: "terms",
  });
});

// new api
router.post("/getCustomerInfo", async (req, res) => {
  const customerInfo = await query(
    "SELECT * FROM customer WHERE id='" + req.body.customerId + "'"
  );
  if (customerInfo) {
    const returnData = customerInfo[0];
    return res.send({
      error: false,
      data: returnData,
      message: "Customer Info",
    });
  } else {
    const returnData = [];
    return res.send({
      error: false,
      data: returnData,
      message: "Customer Info",
    });
  }
});

const get_city_dist_area = async (table_name, id) => {
  try {
    const result = await query(`
    SELECT
        name
    FROM
        ${table_name} 
    WHERE
        id = ${id} AND soft_del='0' AND status='active'
    `);
    return result[0].name;
  } catch (e) {
    return e;
  }
};

// router.get("/get_customer_info/:customer_id", async (req, res) => {
//   const { customer_id } = req.params;
//   try {
//     let customer_info = await query(`
//     SELECT
//         id,
//         name,
//         email,
//         profile_pic,
//         social_login_id,
//         phone_number,
//         address,
//         city_id,
//         district_id,
//         area_id
//     FROM
//         customer
//     WHERE
//         id = ${customer_id} AND status = 'active'
//     `);

//     customer_info = customer_info[0];

//     const { city_id, district_id, area_id } = customer_info;

//     if (city_id !== null) {
//       const city_name = await get_city_dist_area("cities", city_id);
//       customer_info = { ...customer_info, city_name };
//     } else {
//       customer_info = { ...customer_info, city_name: "" };
//     }

//     if (district_id !== null) {
//       const district_name = await get_city_dist_area("districts", district_id);
//       customer_info = {
//         ...customer_info,
//         district_name,
//       };
//     } else {
//       customer_info = { ...customer_info, district_name: "" };
//     }

//     if (area_id !== null) {
//       const area_name = await get_city_dist_area("areas", area_id);
//       customer_info = { ...customer_info, area_name };
//     } else {
//       customer_info = { ...customer_info, area_name: "" };
//     }

//     // customer_info = omit(customer_info[0], ['password', 'status']);
//     return res.json(customer_info);
//   } catch (e) {
//     res.send(e);
//   }
// });

router.get("/get_customer_info/:customer_id", async (req, res) => {
  const { customer_id } = req.params;
  try {
    let customer_info = await query(`
    SELECT
        id,
        name,
        email,
        profile_pic,
        social_login_id,
        phone_number,
        address,
        city,
        thana,
        area,
        district,
        zipcode
    FROM
      customers_address
    WHERE
        id = ${customer_id}
    `);

    customer_info = customer_info[0];

    // const { city_id, district_id, area_id } = customer_info;

    // if (city_id !== null) {
    //   const city_name = await get_city_dist_area("cities", city_id);
    //   customer_info = { ...customer_info, city_name };
    // } else {
    //   customer_info = { ...customer_info, city_name: "" };
    // }

    // if (district_id !== null) {
    //   const district_name = await get_city_dist_area("districts", district_id);
    //   customer_info = {
    //     ...customer_info,
    //     district_name,
    //   };
    // } else {
    //   customer_info = { ...customer_info, district_name: "" };
    // }

    // if (area_id !== null) {
    //   const area_name = await get_city_dist_area("areas", area_id);
    //   customer_info = { ...customer_info, area_name };
    // } else {
    //   customer_info = { ...customer_info, area_name: "" };
    // }

    // customer_info = omit(customer_info[0], ['password', 'status']);
    return res.json(customer_info);
  } catch (e) {
    res.send(e);
  }
});

router.get("/get_order_history/:customer_id", async (req, res) => {
  const { customer_id } = req.params;
  console.log(customer_id);
  try {
    let order_history = await query(`
    SELECT
      o.id,
      o.customer_id,
      p.product_name,
      od.quantity,
      o.order_amount,
      o.shipping_address,
      o.status,
      o.order_time      
    FROM
        \`order\` o 
    join
        order_details od                              
            on o.id = od.order_id      
    join
        products p                              
            on od.product_id = p.id      
    WHERE
        o.customer_id = ${customer_id}
    `);

    return res.json(order_history);
  } catch (e) {
    res.send(e);
  }
});

router.get("/get_districts", async (req, res) => {
  try {
    const districts = await query(`SELECT * FROM districts`);
    res.json(districts);
  } catch (e) {
    res.send(e);
  }
});

router.get("/get_cities_by_district_id/:district_id", async (req, res) => {
  const { district_id } = req.params;

  try {
    const cities = await query(`
      SELECT
          id,
          name,
          district_id 
      FROM
          cities
      WHERE
          district_id = ${district_id} 
          AND soft_del = '0' 
          AND status = 'active'
    `);

    res.json(cities);
  } catch (e) {
    res.send(e);
  }
});

router.get("/get_areas_by_city_id/:city_id", async (req, res) => {
  const { city_id } = req.params;

  try {
    const areas = await query(`
      SELECT
          id,
          name,
          city_id 
      FROM
          areas
      WHERE
          city_id = ${city_id} 
          AND soft_del = '0' 
          AND status = 'active'
    `);

    res.json(areas);
  } catch (e) {
    res.send(e);
  }
});

router.post("/change_customer_address", async (req, res) => {
  const {
    customer_id,
    form_data: { address, phone_number, city_id, district_id, area_id },
  } = req.body;

  try {
    const result = await query(`
    UPDATE
        customer
    SET
        phone_number = "${phone_number}",
        address = "${address}",
        city_id = ${city_id},
        district_id = ${district_id},
        area_id = ${area_id}
    WHERE
        id = ${customer_id}
    `);
    return res.json(result);
  } catch (e) {
    res.send(e);
  }
});

router.post("/change_customer_password", async (req, res) => {
  const {
    customer_id,
    form_data: { old_password, new_password, retype_password },
  } = req.body;
  // console.log(data);
  try {
    let customer_info = await query(
      `SELECT password, social_login_id FROM customer WHERE id="${customer_id}"`
    );

    const { password, social_login_id } = customer_info[0];

    if (!(old_password && new_password && retype_password)) {
      return res.json({ error: true, msg: "Fields cannot be Empty" });
    }

    if (social_login_id === null) {
      if (password !== old_password) {
        return res.json({ error: true, msg: "Invalid Credential" });
      }
    } else {
      if (password !== null) {
        if (password !== old_password) {
          return res.json({ error: true, msg: "Invalid Credential" });
        }
      }
    }

    if (new_password !== retype_password) {
      return res.json({ error: true, msg: "Password not Match" });
    }

    console.log({ old_password, new_password, retype_password });

    await query(`
    UPDATE
        customer
    SET
        password = "${new_password}"
    WHERE
        id = ${customer_id}
    `);

    return res.json({
      error: false,
      msg: "Password Change Successful. Go Back",
    });
  } catch (e) {
    res.send(e);
  }
});

router.post("/upload_customer_profile_photo", async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;

  file.mv(`${upload_path}${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    return res.json({
      file_name: file.name,
      file_path: `/image/profilePic/${file.name}`,
    });
  });
});

router.post("/set_profile_photo", async (req, res) => {
  const { file_name, customer_id } = req.body;

  try {
    const result = await query(`
    UPDATE
        customer
    SET
        profile_pic = "${file_name}"
    WHERE
        id = ${customer_id}
    `);
    return res.status(200).json({ msg: "Profile Photo Updated" });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/searchProductList", async (req, res) => {
  const { searchKey } = req.body;
  const discountArr = await getDiscountArr();

  try {
    const productsInfo = await query(`
    SELECT
        * 
    FROM
        products 
    WHERE
        product_name LIKE '%${searchKey}%' 
        AND status='active' 
        AND softDelete=0
    `);

    let productLists = [];

    for (const product of productsInfo) {
      const discountAmount = getDiscountByProductId(discountArr, product.id);
      productLists = [
        ...productLists,
        { ...product, discountAmount, product_id: product.id },
      ];
    }

    return res.send({
      error: false,
      data: productLists,
      message: "all search product list.",
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/search_filter_products", async (req, res) => {
  const results = await query(
    'SELECT * FROM products WHERE vendor_id = "' +
      req.query.vendorId +
      '" AND category_id = "' +
      req.query.categoryList +
      '"'
  );

  return res.send({ data: results, message: "data" });
});

/*router.get('/search_purchase_products', (req, res) => {
  var searchedProducts = [];

  new Promise(function(resolve, reject) {
    dbConnection.query(
      'SELECT id FROM products WHERE vendor_id = "' +
        req.query.vendorId +
        '" AND product_name LIKE "%' +
        req.query.id +
        '%" OR product_sku LIKE "%' +
        req.query.id +
        '%" ',
      function(error, results) {
        if (error) throw error;
        if (results.length > 0) {
          resolve(results);
        } else {
          reject('rejected');
        }
      }
    );
  })
    .then(function(purchaseElements) {
      async.forEachOf(
        purchaseElements,
        function(purchaseElement, i, inner_callback) {
          var select_sql =
            "SELECT products.id AS id, products.home_image as home_image, products.product_name AS product_name, products.product_sku AS product_sku FROM products JOIN inv_purchase_details ON products.id = inv_purchase_details.productId WHERE products.id='" +
            purchaseElement.id +
            "' AND inv_purchase_details.productId='" +
            purchaseElement.id +
            "' ";
          dbConnection.query(select_sql, function(err, results, fields) {
            if (!err) {
              if (results.length > 0) {
                searchedProducts.push(results);
              }

              inner_callback(null);
            } else {
              console.log('Error while performing Query');
              inner_callback(err);
            }
          });
        },
        function(err) {
          if (err) {
            //handle the error if the query throws an error
            console.log('Error at ASYNC');
            return res.send({ data: [], message: 'data' });
          } else {
            //whatever you wanna do after all the iterations are done
            console.log('Success at ASYNC');
            return res.send({ data: searchedProducts, message: 'data' });
          }
        }
      );
    })
    .catch(function(reject) {
      console.log('Rejected');
      return res.send({ data: [], message: 'data' });
    });
});*/

router.get("/product_list", async (req, res) => {
  try {
    const results = await query(`SELECT * FROM products 
                                 WHERE softDelete = 0 AND isApprove='authorize' AND status = 'active' limit 5`);
    res.json({ data: results });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

router.post("/saveCategory", (req, res) => {
  return res.send(req.body);
});

//mehedi -- 15/01/2020
router.get("/featureproducts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let featureNameInfo = await query(`
      SELECT
          id featureId,
          name featureName
      FROM
          feature_name
      WHERE
          id = ${id} AND softDel=0 AND status=1
    `);

    // return res.json({ featureNameInfo });

    const discountArr = await getDiscountArr();

    const products = await featureProductHelper.getFeatureProductsInfo(
      id,
      discountArr
    );

    const result = {
      featureId: featureNameInfo[0].featureId,
      featureName: featureNameInfo[0].featureName,
      products: products,
    };

    res.json({ results: size(result), data: result });
  } catch (e) {
    console.error(e);
    res.json(e);
  }
});

// route api/feature_category
// desc  Get feature Categories and build the tree
router.get("/feature_category", async (req, res) => {
  let res_arr = [];

  try {
    const featured_categories = await query("SELECT * FROM featured_category");
    // return res.json({ featured_categories });

    for (const fc_id of featured_categories) {
      const { category_id } = fc_id;
      let resObj = {};

      const parent = await query(
        `SELECT * FROM category WHERE id=${category_id} AND status='active'`
      );

      if (!parent.length) {
        resObj.parent = null;
        return res.json([...res_arr, resObj]);
      }

      resObj.parent = parent[0];
      resObj.subCat = [];

      const first_children = await getChildrenFromCategory(category_id);

      if (!first_children.length) {
        resObj.f_children = null;
        return res.json([...res_arr, resObj]);
      }

      const randomFirstChildren = await getRandomChildArr(first_children, 2);
      // if no children of first_children return lastChildren NULL
      if (!randomFirstChildren.length) {
        resObj.parent = null;
        return res.json([...res_arr, resObj]);
      }

      resObj.f_children = randomFirstChildren;

      let subcatArr = [];
      let total_products_arr = [];

      for (const [i, { id }] of randomFirstChildren.entries()) {
        const l_children = await getChildrenFromCategory(id);
        const cat = await getRandomProductArr(l_children, 3);

        if (cat.length) {
          let product_arr = [];
          for (const { products } of cat) {
            product_arr = [...product_arr, ...products];
          }

          total_products_arr = [...total_products_arr, ...product_arr];

          const random_product = sampleSize(product_arr, 1)[0];

          subcatArr = [...subcatArr, { cat_id: id, ...random_product }];

          resObj["tree" + (i + 1)] = cat;
        } else {
          resObj["tree" + (i + 1)] = null;
          subcatArr = [...subcatArr, {}];
        }
      }

      resObj.subCat = subcatArr;

      if (
        !(resObj.hasOwnProperty("tree1") || resObj.hasOwnProperty("tree2")) ||
        resObj.subCat.length === 0
      ) {
        resObj.parent = null;
        res_arr = [...res_arr, resObj];
      } else {
        while (true) {
          const one_random_product = sampleSize(total_products_arr, 1)[0];
          const is_same = subcatArr.filter(
            (el) => el.product_id === one_random_product.product_id
          );

          if (is_same.length === 0) {
            resObj.parent = { cat_id: parent[0].id, ...one_random_product };
            break;
          }
        }
        res_arr = [...res_arr, resObj];
      }
    }
    return res.json(res_arr);
  } catch (e) {
    res.send(e);
  }
});

// route api/vendors
// desc  get all vendors for index page
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await query(`SELECT vd.id, vd.slug, vd.name, vd.shop_name, vd.vendor_id, vd.logo 
                              FROM vendor_details vd JOIN vendor v ON v.id=vd.vendor_id
                              WHERE vd.status=1 AND vd.softDel=0`);
    res.json({ data: { title: "Brand eShop", vendors } });
  } catch (e) {
    console.error(e.message);
    res.status(500).send("Server Error");
  }
});

router.post("/check_inventory", async (req, res) => {
  let { productId, colorId, sizeId } = req.body;
  productId = !!productId ? productId : 0;

  if (!productId)
    return res.json({ msg: "A productId is required", net_products: 0 });
  try {
    const net_products = await checkInventoryFunc(productId, colorId, sizeId);
    res.json({ net_products });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

router.post("/checkInventory", async (req, res) => {
  try {
    // const cartData = req.body.cartProducts;
    const { cartProducts } = req.body;

    for (const { id, quantity, color, size } of cartProducts) {
      const netProductQuantity = await netProductsFromStock(
        id,
        // color.id,
        // size.id
        color,
        size
      );

      if (netProductQuantity <= 0) {
        return res.status(200).json({
          error: false,
          data: false,
          message: "Product not in Inventory!",
          netProductQuantity: netProductQuantity,
        });
      }
      if (netProductQuantity < quantity) {
        return res.status(200).json({
          error: false,
          data: false,
          message: "Product not in Inventory!",
          netProductQuantity: netProductQuantity,
        });
      }
    }

    return res.status(200).send({
      error: false,
      data: true,
      message: "Ok!",
    });
  } catch (error) {
    return res
      .status(404)
      .send({ error: true, data: false, message: error.message });
  }
});

router.get("/checkProductAvailability/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const isProductFound = await checkProductAvailability(id);
    res.json({ isProductFound });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

// get net products amount from stock table
router.post("/getNetProductsFromStock", async (req, res) => {
  let { productId, colorId, sizeId } = req.body;
  productId = !!productId ? productId : 0;

  if (!productId)
    return res.json({ msg: "A productId is required", net_products: 0 });
  try {
    const net_products = await netProductsFromStock(productId, colorId, sizeId);
    res.json({ net_products });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

router.get("/productListByCat/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await showProductListByCategory(id);
    res.json([...data]);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});

router.get("/productCombinationsFromStock/:p_id", async (req, res) => {
  const { p_id } = req.params;
  try {
    const combinations = await query(`
                                SELECT productId, colorId, sizeId, SUM(quantity) as quantity
                                FROM stock 
                                WHERE productId=${p_id} AND status = 1 AND softDel = 0 AND quantity > 0
                                GROUP BY productId, colorId, sizeId
                              `);
    res.status(200).json({ combinations });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

//Apis for site-map
router.get("/product_ids_for_site_map", async (req, res) => {
  try {
    const ids = await query(`
    SELECT
        id 
    FROM
        products 
    WHERE
        status='active'     
        AND isApprove='authorize' 
        AND softDelete=0
    `);
    res.status(200).json(ids);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

router.get("/category_ids_for_site_map", async (req, res) => {
  try {
    const ids = await query(`
    SELECT
        id 
    FROM
        category 
    WHERE
        status='active'     
        AND softDel=0
    `);
    res.status(200).json(ids);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

router.get("/featureproduct_ids_for_site_map", async (req, res) => {
  try {
    const ids = await query(`
        SELECT
            id
        FROM
            feature_name
        WHERE
            softDel=0 AND status=1
      `);
    res.status(200).json(ids);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

router.get("/vendor_ids_for_site_map", async (req, res) => {
  try {
    const ids = await query(`
      SELECT
          id
      FROM
          vendor
      WHERE
          status='active'
          AND softDel=0
      `);
    res.status(200).json(ids);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

/*
 * Policy Pages - API
 */

router.get("/getPolicyList", async (req, res) => {
  try {
    const data = await query(`
        SELECT 
          * 
        FROM 
          terms_conditions_type
        WHERE 
          softDel = 0
    `);
    res.status(200).json([...data]);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/getPolicy/:policyname", async (req, res) => {
  try {
    let { policyname } = req.params;

    policyname = slugify(policyname, {
      replacement: "-", // replace spaces with replacement character, defaults to `-`
      remove: undefined, // remove characters that match regex, defaults to `undefined`
      lower: true, // convert to lower case, defaults to `false`
      strict: false, // strip special characters except replacement, defaults to `false`
      locale: "vi", // language code of the locale to use
    });

    const data = await query(`
      SELECT 
        terms_and_conditions 
      FROM 
        terms_conditions
      WHERE 
        condition_type_id IN (
          SELECT 
            id 
          FROM 
            terms_conditions_type 
          WHERE 
            slugify(name) LIKE '${policyname}'
        )
    `);

    // let dbq = await query(`SELECT id FROM terms_conditions_type WHERE slugify(name) LIKE '${policyname}'`)
    // res.send(dbq)
    res.status(200).json([...data]);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

//
// Dynamic Logo, URL and Name fetch for Banijjo.com and Banijjo.com.bd
//
router.get("/getCompanyInfo", async (req, res) => {
  try {
    const data = await query(`
      SELECT 
        name, logo, logo_mob, qrcode, email, phone, telephone, website 
      FROM 
        gnr_company
      WHERE 
        status = 1
      LIMIT 1
    `);
    res.status(200).json([...data]);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

router.get("/top_main_banners", async (req, res) => {
  try {
    const mainBanners = await query(
      `SELECT id, name, image, url FROM banner WHERE softDel = 0 AND status = 1 order by rand() limit 5`
    );
    console.log(mainBanners);
    res.json({ data: mainBanners });
  } catch (e) {
    console.error(e);
    res.send(e);
  }
});






// CART APIs

router.post("/cart/getProductStockQuantity", async (req, res) => {
  let { productId, colorId, sizeId } = req.body;
  productId = !!productId ? productId*1 : 0;
  colorId = !!colorId ? colorId*1 : 0;
  sizeId = !!sizeId ? sizeId*1 : 0;
  try {
    const stockQuantity = await getProductStockQuantity(
      productId,
      colorId,
      sizeId
    );
    res.json({ stockQuantity });
  } catch (e) {
    console.error(e);
    res.status(500).send("Server Error");
  }
});



/*
*
* FORGOT PASSWORD
*
*/

const mailBox = nodemailer.createTransport({
  service: 'banijjo',
  auth: {
    user: 'info@banijjo.com.bd',
    pass: 'banijjo!@#$%'
  },
  tls: {
    rejectUnauthorized: false
  }
});


router.post('/submit-email-for-password-reset', async function (req, res) {
  try {
      const cipher = crypto.createCipher('aes192', 'a password');
      var encrypted = cipher.update(req.body.email_address, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      var url = `https://store.banijjo.com.bd/resetpassword/${encrypted}`

      var mailOption = {
          from : 'info@banijjo.com.bd',
          to : req.body.email_address,
          subject : 'Reset Password',
          html: `Please click the link to reset your password : <a href="${url}"> ${url} </a>`
      }

      mailBox.sendMail(mailOption, function (error, info) {
          if (error) {
              console.log(error);
          }
          else {
              console.log('Email sent : ', info,process);
          }
      })    
      return res.send({success: true, message: 'Succesfully sent the link to your email address!'});
  } catch (e) {
      console.log(e);
      return res.send({success: false, message: 'Something went wrong! Please try again later!', error: e});
  }
});


//Apis for site-map
router.use("/", require("./sitemap.routes"));

/*
 * Policy Pages - API
 */
router.use("/policy", require("./policy.routes"));

/*
 * E-COURIER API MODULE | request redirect : baseurl/api/ecourier/
 */
router.use("/ecourier", require("./ecourier.v0.js"));

/*
 * DMONEY API MODULE | request redirect : baseurl/api/dmoney/
 */
router.use("/dmoney", require("./dmoney.v0.js"));

module.exports = router;
