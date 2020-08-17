import React from "react";
import {
  calDiscountPercentage,
  capitalizeStr,
  capitalize_and_shorten_name
} from "./../../utils/utils";
import ProductCardConditional from '../shared/product-card-conditional';

const fileUrl = process.env.REACT_APP_FILE_URL;

const ListingFeaturedCategoryTreeMB = ({ featuredCategories }) => {

  const { parent, subCat, tree1, tree2 } = featuredCategories;
  
  return (
    <>
      {/* parent */}
      <div className="row">
        <div className="col-md-12  mb-3">
          {parent && (
            <ProductCardConditional
              product={parent}
              customNewLabelCSSDesktop="product-new-label"
              customDiscountCSSDesktop="product-new-label-discount"
              customNewLabelCSSMobile="product-new-label-featureCatParent "
              customDiscountCSSMobile="product-new-label-discount-featureCatParent"
            />
          )}
        </div>
      </div>
      {/* end of parent */}

      {/* subCat */}
      <div className="row ">
        <div className="col-6">
          {subCat && (
            <ProductCardConditional
              product={subCat[0]}
              customNewLabelCSSDesktop="product-new-label"
              customDiscountCSSDesktop="product-new-label-discount"
              customNewLabelCSSMobile="product-new-label-twoDiv"
              customDiscountCSSMobile="product-new-label-discount-twoDiv"
            />
          )}
        </div>

        <div className="col-6">
          {subCat && (
            <ProductCardConditional
              product={subCat[1]}
              customNewLabelCSSDesktop="product-new-label"
              customDiscountCSSDesktop="product-new-label-discount"
              customNewLabelCSSMobile="product-new-label-twoDiv"
              customDiscountCSSMobile="product-new-label-discount-twoDiv"
            />
          )}
        </div>
      </div>
      {/* end of subCat */}

      {/* tree 1 */}
      {tree1 &&
        tree1.map((tree) => (
          <>
            <div className="row">
              <div className="col-12 mt-1">
                <h1 className="h6 float-left" key={tree.cat_info.id}>
                  {capitalizeStr(tree.cat_info.category_name)}
                </h1>
                <a href={`/productList/${tree.cat_info.slug}`} className="float-right see-more">
                  See More
                </a>
              </div>
            </div>

            <div className="row no-gutters">
              {tree.products.length > 0 &&
                tree.products.map((product) => (
                  <div className="col-4 pr-2" key={product.product_id}>
                    <ProductCardConditional
                      product={product}
                      customNewLabelCSSDesktop="product-new-label-others"
                      customDiscountCSSDesktop="product-new-label-discount-others"
                      customNewLabelCSSMobile="product-new-label-threeDiv"
                      customDiscountCSSMobile="product-new-label-discount-threeDiv"
                    />
                  </div>
                ))}
            </div>
          </>
        ))}

      {/* tree 2 */}
      {tree2 &&
        tree2.map((tree) => (
          <>
            <div className="row">
              <div className="col-12 mt-1">
                <h1 className="h6 float-left" key={tree.cat_info.id}>
                  {capitalizeStr(tree.cat_info.category_name)}
                </h1>
                <a href={`/productList/${tree.cat_info.slug}`} className="float-right see-more">
                  See More
                </a>
              </div>
            </div>

            <div className="row no-gutters">
              {tree.products.length > 0 &&
                tree.products.map((product) => (
                  <div className="col-4 pr-2" key={product.product_id}>
                    <ProductCardConditional
                      product={product}
                      customNewLabelCSSDesktop="product-new-label-others"
                      customDiscountCSSDesktop="product-new-label-discount-others"
                      customNewLabelCSSMobile="product-new-label-threeDiv"
                      customDiscountCSSMobile="product-new-label-discount-threeDiv"
                    />
                  </div>
                ))}
            </div>
          </>
        ))}
    </>
  );
};

export default ListingFeaturedCategoryTreeMB;
