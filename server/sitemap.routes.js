const express = require('express')
const urlSlug = require('url-slug')
const {getIdFromSlug} = require("./slug.helpers");
const { query } = require('../db_config');

const router = express.Router();

router.get('/product_ids_for_site_map', async (req, res) => {
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

router.get('/category_ids_for_site_map', async (req, res) => {
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

router.get('/featureproduct_ids_for_site_map', async (req, res) => {
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

router.get('/vendor_ids_for_site_map', async (req, res) => {
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


router.get('/get_sitemap_vendors', async (req, res) => {
  try {
    const vendorIds = await query(`
      SELECT vd.slug 
      FROM vendor_details vd 
      JOIN vendor v 
      ON v.id=vd.vendor_id
      WHERE vd.status=1 AND vd.softDel=0
    `);

    let vendorSitemap = [];
    vendorIds.forEach(vendor => {
      let url = `<url> <loc>https://www.banijjo.com.bd/vendor/${vendor.slug}</loc> </url>`;
      vendorSitemap.push(url)
    });

    res.json(vendorSitemap);

  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

router.get('/get_sitemap_product_list', async (req, res) => {
  try {
    const categories = await query(`
    SELECT
        slug 
    FROM
        category 
    WHERE
        status='active'     
        AND softDel=0
    `);

    let sitemap = [];
    categories.forEach(productList => {
      let url = `<url> <loc>https://www.banijjo.com.bd/productList/${productList.slug}</loc> </url>`;
      sitemap.push(url)
    });

    res.json(sitemap);

  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});

router.get('/get_sitemap_product_details', async (req, res) => {
  try {
    const products = await query(`
    SELECT
        slug 
    FROM
        products 
    WHERE
        status='active'     
        AND isApprove='authorize' 
        AND softDelete=0
    `);

    let sitemap = [];
    products.forEach(product => {
      let url = `<url> <loc>https://www.banijjo.com.bd/productDetails/${product.slug}</loc> </url>`;
      sitemap.push(url)
    });

    res.json(sitemap);

  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
});


router.get('/sitemap.xml', async function(req, res, next){
  let xml_content = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">',
    ' <url><loc>http://www.example.com/</loc></url>',
    ' <url> <loc>https://www.banijjo.com/</loc> </url>',
    ' <url> <loc>https://www.banijjo.com/moreCategory</loc> </url>',
    ' <url> <loc>https://www.banijjo.com/contactUs</loc> </url>',
    ' <url> <loc>https://www.banijjo.com/register</loc> </url>',
    ' <url> <loc>https://www.banijjo.com/login</loc> </url>',
    ' <url> <loc>https://www.banijjo.com/policy/terms-and-condition-1</loc> </url>',
    ' <url> <loc>https://www.banijjo.com/policy/privacy-policy-2</loc> </url>',
    ' <url> <loc>https://www.banijjo.com/policy/cookie-policy-3</loc> </url>',
    ' <url> <loc>https://www.banijjo.com/policy/warranty-policy-4</loc> </url>',
    ' <url> <loc>https://www.banijjo.com/policy/shipping-policy-5</loc> </url>',
    ' <url> <loc>https://www.banijjo.com/policy/returns-and-replacement-6</loc> </url>',    
    '</urlset>'
  ]
  res.set('Content-Type', 'text/xml')
  res.send(xml_content.join('\n'))
  // res.sendFile('sitemap.xml', { root: '.' }) 
})

module.exports = router;
