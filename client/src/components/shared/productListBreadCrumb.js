import React from 'react';

const ProductListBreadCrumb = ({ breadcrumbs }) => (
  <>
    <ul className="breadcrumbProduct px-3 py-2 mb-2">
      {breadcrumbs.length > 0 &&
        breadcrumbs.map(({ id, slug, category_name }) => (
          <li className="d-inline-block" key={id}>
            <a href={`/productList/${slug}`} className="text-primary">
              {category_name}
            </a>
          </li>
        ))}
    </ul>
  </>
);

export default ProductListBreadCrumb;
