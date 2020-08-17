import React from 'react';
import {
  calDiscountPercentage,
  capitalizeStr,
  shorten_the_name,
  capitalize_and_shorten_name
} from '../../utils/utils';

const file_url = process.env.REACT_APP_FILE_URL;
const img_src = `${file_url}/upload/product/compressedProductImages`;

const ProductCardConditional = ({ product, customNewLabelCSSDesktop, customDiscountCSSDesktop, customNewLabelCSSMobile, customDiscountCSSMobile }) => {

  product['images'] = JSON.parse(product.image);

  return (
    <>
      <div className="card">
        <a href={`/productDetails/${product.slug}`}>
          <img
            className="card-img-top"
            src={`${img_src}/${product.home_image}`}
            onMouseOver={(e) =>
              (e.currentTarget.src = `${img_src}/${product.images[1].imageName}`)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src = `${img_src}/${product.home_image}`)
            }
            alt={capitalizeStr(product.product_name)}
            title={capitalizeStr(product.product_name)}
          />
        </a>

        {/* desktop  */}
        <div className="d-none d-lg-block">
          {product.newProduct === 1 && (
            <span className={`${customNewLabelCSSDesktop}`}>New</span>
          )}

          {product.discountAmount != 0 && (
            <span className={`${customDiscountCSSDesktop}`}>
              {/* {calDiscountPercentage(
                product.discountAmount,
                product.productPrice
              )} */}
              0%
            </span>
          )}
        </div>

        {/* mobile */}
        <div className="d-block d-lg-none">
          {product.newProduct === 1 && (
            <span className={`${customNewLabelCSSMobile}`}>New</span>
          )}

          {product.discountAmount != 0 && (
            <span className={`${customDiscountCSSMobile}`}>
              {/* {calDiscountPercentage(
                product.discountAmount,
                product.productPrice
              )} */}
              0%
            </span>
          )}
        </div>

        <div className="card-body">
          <div className="text-center">
            <h1 className="card-title h6">
              <a href={`/productDetails/${product.slug}`}>
                <span className="text-primary">
                  {capitalize_and_shorten_name(product.product_name)}
                </span>
              </a>
            </h1>
            <p className="card-text">
              ৳&nbsp;{product.productPrice - product.discountAmount}
              {product.discountAmount > 0 && (
                <span>৳&nbsp;{product.productPrice}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCardConditional;
