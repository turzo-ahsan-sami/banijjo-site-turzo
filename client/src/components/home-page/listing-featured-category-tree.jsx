import React from "react";
import {
  calDiscountPercentage,
  capitalizeStr,
  capitalize_and_shorten_name  
} from "./../../utils/utils";

const fileUrl = process.env.REACT_APP_FILE_URL;

const CardDemo = ({ product }) => (
  <>
    <div className="card">
    <a href={`/productDetails/${product.slug}`} >
      <img
        className="card-img-top max-height-65"
        src={`${fileUrl}/upload/product/compressedProductImages/${product.home_image}`}
        onMouseOver={(e) =>
          (e.currentTarget.src = `${fileUrl}/upload/product/compressedProductImages/${product.images[1].imageName}`)
        }
        onMouseOut={(e) =>
          (e.currentTarget.src = `${fileUrl}/upload/product/compressedProductImages/${product.home_image}`)
        }
        alt={capitalizeStr(product.product_name)}
        title={capitalizeStr(product.product_name)}
      />

      {product.newProduct === 1 && (
        <span className="product-new-label-feature-subchild">New</span>
      )}

      {product.discountAmount != 0 && (
        <span className="product-new-label-discount-feature-subchild">
          {calDiscountPercentage(product.discountAmount, product.productPrice)}%
        </span>
      )}

      <div className="card-body">
        <div className="text-center">
          <h1 className="card-title h4 mb-0 custom-font-size">
            <span className="text-primary">
              {capitalize_and_shorten_name(product.product_name)}
            </span>
          </h1>
          <p className="card-text custom-font-size">
            ৳&nbsp;{product.productPrice}
          </p>
        </div>
      </div>
      </a>
    </div>


  </>
);

const ListingFeaturedCategoryTree = ({ featuredCategories }) => {

  const { parent, subCat, tree1, tree2 } = featuredCategories;

  if(parent) parent['images'] = JSON.parse(parent.image);
  if(subCat) {
    subCat[0]['images'] = JSON.parse(subCat[0].image); 
    subCat[1]['images'] = JSON.parse(subCat[1].image);
  }
  if(tree1){    
    tree1.map(tree => {
      if(tree){
        tree.products.map(product => {
          if(product) product['images'] = JSON.parse(product.image)
        })
      }
    })                      
  }
  if(tree2){    
    tree2.map(tree => {
      if(tree){
        tree.products.map(product => {
          if(product) product['images'] = JSON.parse(product.image)
        })
      }
    })                      
  }
  
  return (
    <>
      <div className="row no-gutters">
        {/* parent  */}
        {/* <div className="col-3 my-auto pr-4"> */}
        <div className="listing-feature-category-desktop my-auto pr-4">
          {parent && (
            <div className="card">
              <a href={`/productDetails/${parent.slug}`} >
              <img
                className="card-img-top"
                // src={`${fileUrl}/upload/product/compressedProductImages/${parent.home_image}`}
                src={`${fileUrl}/upload/product/compressedProductImages/${parent.home_image}`}
                onMouseOver={(e) =>
                  (e.currentTarget.src = `${fileUrl}/upload/product/compressedProductImages/${parent.images[1].imageName}`)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.src = `${fileUrl}/upload/product/compressedProductImages/${parent.home_image}`)
                }
                alt={capitalizeStr(parent.product_name)}
                title={capitalizeStr(parent.product_name)}
              />

              {parent.newProduct !== 1 && (
                <span className="product-new-label">New</span>
              )}

              {parent.discountAmount === 0 && (
                <span className="product-new-label-discount-feature-parent">
                  {calDiscountPercentage(
                    parent.discountAmount,
                    parent.productPrice
                  )}
                  %
                </span>
              )}

              <div className="card-body">
                <div className="text-center">
                  <h1 className="card-title h4 my-1">
                    <span className="text-primary">
                      {capitalize_and_shorten_name(parent.product_name)}
                    </span>
                  </h1>
                  <p className={`card-text`}>৳&nbsp;{parent.productPrice}</p>
                </div>
              </div>
              </a>
            </div>
          )}
        </div>

        {/* subCat */}
        {/* <div className="col-2 my-auto pr-3"> */}
        <div className="listing-feature-subcategory-desktop my-auto pr-3">
          <div className="row ">
            <div className="col-12">
              {subCat && (
                <div className="card">
                  <a href={`/productDetails/${subCat[0].slug}`} >
                  <img
                    className="card-img-top"
                    style={{ maxHeight: "85px" }}
                    // src={`${fileUrl}/upload/product/compressedProductImages/${subCat[0].home_image}`}
                    src={`${fileUrl}/upload/product/compressedProductImages/${subCat[0].home_image}`}
                    onMouseOver={(e) =>
                      (e.currentTarget.src = `${fileUrl}/upload/product/compressedProductImages/${subCat[0].images[1].imageName}`)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.src = `${fileUrl}/upload/product/compressedProductImages/${subCat[0].home_image}`)
                    }
                    alt={capitalizeStr(subCat[0].product_name)}
                    title={capitalizeStr(subCat[0].product_name)}
                  />

                  {subCat[0].newProduct !== 1 && (
                    <span className="product-new-label-small-carousel">
                      New
                    </span>
                  )}

                  {subCat[0].discountAmount === 0 && (
                    <span className="product-new-label-discount-feature-child">
                      {calDiscountPercentage(
                        subCat[0].discountAmount,
                        subCat[0].productPrice
                      )}
                      %
                    </span>
                  )}

                  <div className="card-body">
                    <div className="text-center">
                      <h1 className="card-title h6 custom-font-size mb-0">
                        <span className="text-primary">
                          {capitalize_and_shorten_name(parent.product_name)}
                        </span>
                      </h1>
                      <p className={`card-text`}>
                        ৳&nbsp;{parent.productPrice}
                      </p>
                    </div>
                  </div>
                  </a>
                </div>
              )}
            </div>

            <div className="col-12 mt-1">
              {subCat && (
                <div className="card">
                  <a href={`/productDetails/${subCat[1].slug}`} >
                  <img
                    className="card-img-top"
                    style={{ maxHeight: "85px" }}
                    // src={`${fileUrl}/upload/product/compressedProductImages/${subCat[1].home_image}`}
                    src={`${fileUrl}/upload/product/compressedProductImages/${subCat[1].home_image}`}
                    onMouseOver={(e) =>
                      (e.currentTarget.src = `${fileUrl}/upload/product/compressedProductImages/${subCat[1].images[1].imageName}`)
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.src = `${fileUrl}/upload/product/compressedProductImages/${subCat[1].home_image}`)
                    }
                    alt={capitalizeStr(subCat[0].product_name)}
                    title={capitalizeStr(subCat[0].product_name)}
                  />

                  {subCat[1].newProduct !== 1 && (
                    <span className="product-new-label-small-carousel">
                      New
                    </span>
                  )}

                  {subCat[1].discountAmount === 0 && (
                    <span className="product-new-label-discount-feature-child">
                      {calDiscountPercentage(
                        subCat[1].discountAmount,
                        subCat[1].productPrice
                      )}
                      %
                    </span>
                  )}

                  <div className="card-body">
                    <div className="text-center">
                      <h1 className="card-title h6 custom-font-size mb-0">
                        <span className="text-primary">
                          {capitalize_and_shorten_name(parent.product_name)}
                        </span>
                      </h1>
                      <p className={`card-text`}>
                        ৳&nbsp;{parent.productPrice}
                      </p>
                    </div>
                  </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <div className="col-7 my-auto"> */}
        <div className="listing-feature-tree-desktop my-auto">
          {/* tree 1 */}
          {tree1 && (
            <div className="row no-gutters mt-n4">
              {tree1.length > 0 &&
                tree1.map((tree) => (
                  <div className="col-6 pr-3" key={tree.cat_info.id}>
                    <div className="row">
                      <div className="col-12 mt-n2 pl-4">
                        <h1 className="h6 d-inline-block text-secondary">
                          {capitalizeStr(tree.cat_info.category_name)}
                        </h1>
                        <a
                          href={`/productList/${tree.cat_info.slug}`}
                          className="text-primary float-right mr-1"
                          style={{ fontSize: ".7rem" }}
                        >
                          See More
                        </a>
                      </div>
                    </div>

                    <div className="row no-gutters">
                      {tree.products.length > 0 &&
                        tree.products.map((product) => (
                          <div className="col-4 pl-2" key={product.product_id}>
                            <CardDemo product={product} />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* tree 2 */}
          {tree2 && (
            <div className="row no-gutters mt-2">
              {tree2.length > 0 &&
                tree2.map((tree) => (
                  <div className="col-6 pr-3" key={tree.cat_info.id}>
                    <div className="row">
                      <div className="col-12 mt-n2 pl-4">
                        <h1 className="h6 d-inline-block text-secondary">
                          {capitalizeStr(tree.cat_info.category_name)}
                        </h1>
                        <a
                          href={`/productList/${tree.cat_info.slug}`}
                          className="text-primary float-right mr-1"
                          style={{ fontSize: ".7rem" }}
                        >
                          See More
                        </a>
                      </div>
                    </div>

                    <div className="row no-gutters">
                      {tree.products.length > 0 &&
                        tree.products.map((product) => (
                          <div className="col-4 pl-2" key={product.product_id}>
                            <CardDemo product={product} />
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default ListingFeaturedCategoryTree;
