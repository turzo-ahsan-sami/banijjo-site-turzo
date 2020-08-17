import React from 'react';
import {
  calDiscountPercentage,
  capitalizeStr,
  shorten_the_name,
} from '../../utils/utils';

const file_url = process.env.REACT_APP_FILE_URL;
const img_src = `${file_url}/upload/product/compressedProductImages`;

const ProductCard = ({ product, customTitleCSS, customTextCSS }) => {

  product['images'] = JSON.parse(product.image);

  return (
    <>
      <div className="card">
        <a href={`/productDetails/${product.slug}`} >          
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
            <span className="product-new-label">New</span>
          )}

          {product.discountAmount != 0 && (
            <span className="product-new-label-discount">
              {calDiscountPercentage(
                product.discountAmount,
                product.productPrice
              )}
              %
            </span>
          )}
        </div>

        {/* mobile */}
        <div className="d-block d-lg-none">
          {product.newProduct === 1 && (
            <span className="product-new-label-small-carousel">New</span>
          )}

          {product.discountAmount != 0 && (
            <span className="product-new-label-discount-small-carousel">
              {calDiscountPercentage(
                product.discountAmount,
                product.productPrice
              )}
              %
            </span>
          )}
        </div>

        <div className="card-body">
          <div className="text-center">
            <h1
              className={`card-title h6 ${
                customTitleCSS && 'custom-cart-title-font-size'
              }`}
            >
              {/* <a href={`/product-details/${product.product_id}`} > */}
              <a href={`/productDetails/${product.slug}`} >
                <span className="text-primary">
                  {shorten_the_name(capitalizeStr(product.product_name))}
                </span>
              </a>
            </h1>
            <p
              className={`card-text ${
                customTextCSS && 'custom-cart-text-font-size'
              }`}
            >
              ৳&nbsp;{product.productPrice - product.discountAmount}
              {product.discountAmount > 0 && (
                <span>৳&nbsp;{product.productPrice}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .custom-cart-title-font-size {
          font-size: 0.85rem;
        }

        .custom-cart-text-font-size {
          font-size: 0.75rem;
        }

        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default ProductCard;
