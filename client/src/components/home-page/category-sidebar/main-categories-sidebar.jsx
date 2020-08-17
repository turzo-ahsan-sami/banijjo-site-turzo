import React from 'react';
import ListingSubcategories from './listing-subcategories';
import ListingVendorImages from './listing-vendor-images';

const MainCategoriesSidebar = ({ categories }) => {
  return (
    <div className="visible-md-block visible-lg-block">
      <div id="sp_vertical_megamenu" className="sp-vertical-megamenu clearfix">
        <h2 className="cat-title">
          <i className="fa fa-list-ul" aria-hidden="true" /> Categories
        </h2>

        <ul className="vf-megamenu clearfix megamenu-content">
          {categories.length > 0 &&
            categories.map(({ category, subcategories, vendorImages }) => (
              <li className="spvmm-havechild" key={category.id}>
                <a className="megamenu_a" href={'/productList/' + category.slug}>
                  {category.category_name}
                </a>
                <span className="vf-button icon-close" />

                <div className="spvmm_container_menu_child">
                  <div className="spvmm_menu_child childRespinssive">
                    <div className="spvmm_numbers_col">
                      <div className="row">
                        {subcategories.length > 0 && (
                          <ListingSubcategories subcategories={subcategories} />
                        )}
                      </div>

                      {vendorImages.length > 0 && (
                        <div className="row">
                          <p className="vendor-Image">Brand</p>
                          <ul className="spvmm_submm_ul">
                            <div className="sub-cate-row scp-cate-brand">
                            <ul className="sub-brand-list sub-brand-list-gutter">
                                <ListingVendorImages
                                  vendorImages={vendorImages}
                                />
                              </ul>
                            </div>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}

          <li className="text-left spvmm-nochild">
            <a href="/moreCategory">
              <span className="megamenu_b">
                <i className="fa fa-plus-circle">
                  <span>More</span>
                </i>
              </span>
            </a>
          </li>
        </ul>
      </div>

      {/* </div> */}
    </div>
  );
};

export default MainCategoriesSidebar;
