import React from 'react';

const ListingSubcategories = ({ subcategories }) => {
  return (
    <>
      {subcategories.map(({ category: { id, slug, category_name }, lastChilds }) => (
        <ul className="spvmm_submm_ul" key={id}>
          <li className="spvmm_submm_li  spvmm-havechildchild">
            <a href={`/productList/${slug}`} className="megamenu_a font-weight-bold">
              {category_name}
            </a>
            {lastChilds.length > 0 && (
              <ul
                className="spvmm_submm_ul"
                style={{
                  zIndex: 1000,
                }}
              >
                {lastChilds.map(({ id, slug, category_name }) => (
                  <li className="spvmm_submm_li ml-4" key={id}>
                    <a href={`/productList/${slug}`} className="megamenu_a">
                      {category_name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      ))}
    </>
  );
};

export default ListingSubcategories;
