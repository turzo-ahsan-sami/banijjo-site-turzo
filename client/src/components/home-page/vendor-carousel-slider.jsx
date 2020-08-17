import React from 'react';
import Carousel from 'react-multi-carousel';
import { capitalizeStr } from '../../utils/utils';

const fileUrl = process.env.REACT_APP_FILE_URL;

const VendorCarouselSlider = ({ vendors }) => {
  return (
    <>
      {vendors && (
        <Carousel
          additionalTransfrom={1}
          arrows
          autoPlay
          autoPlaySpeed={2000}
          centerMode={false}
          className=""
          containerClass=""
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 992,
              },
              items: 5,
              partialVisibilityGutter: 40,
            },
            tablet: {
              breakpoint: {
                max: 991.98,
                min: 576,
              },
              items: 3,
            },
            mobile: {
              breakpoint: {
                max: 575.98,
                min: 0,
              },
              items: 3,
            },
          }}
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
          removeArrowOnDeviceType={['tablet', 'mobile', 'desktop']}
        >
          {vendors.length > 0 &&
            vendors.map(({ name, slug, shop_name, vendor_id, logo }) => (
              <div className="mr-4" key={vendor_id}>
                <div className="card">
                  <a href={`/vendor/${slug}`}>
                    <img
                      className="card-img-top cursor-pointer vendor-carousel-img"
                      src={`${fileUrl}/upload/compressedVendorImages/${logo}`}
                      alt={capitalizeStr(shop_name)}
                      title={capitalizeStr(shop_name)}
                    />
                  </a>
                </div>
              </div>
            ))}
        </Carousel>
      )}
    </>
  );
};

export default VendorCarouselSlider;
