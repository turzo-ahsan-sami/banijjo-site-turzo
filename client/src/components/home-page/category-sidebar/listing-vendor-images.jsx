import React from 'react';

const fileUrl = process.env.REACT_APP_FILE_URL;

const ListingVendorImages = ({ vendorImages }) => {
  return (
    <>
      {vendorImages.map(({ vendor_id, shop_name, slug, logo }) => (
        <li className="sup-brand-item mr-4" key={vendor_id}>
          <a href={`/vendor/${slug}`}>
            <span className="megamenu_a">
              {logo !== null ? (
                <img
                  src={`${fileUrl}/upload/compressedVendorImages/${logo}`}
                  className="img-fluid"
                  alt={vendor_id}
                  title={shop_name}
                />
              ) : (
                <img
                  src={`${fileUrl}/upload/compressedVendorImages/default.png`}
                  className="img-fluid"
                  alt={vendor_id}
                  title={shop_name}
                />
              )}
            </span>
          </a>
        </li>
      ))}
    </>
  );
};

export default ListingVendorImages;
