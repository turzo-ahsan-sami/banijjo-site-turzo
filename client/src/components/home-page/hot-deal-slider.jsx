import React from 'react';
import Carousel from 'react-multi-carousel';
import ProductCardConditional from '../shared/product-card-conditional';

const HotDealSlider = ({ products }) => {
  return (
    <>
      <Carousel
        additionalTransfrom={1}
        arrows
        autoPlay
        autoPlaySpeed={3000}
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
        slidesToSlide={2}
        swipeable
        removeArrowOnDeviceType={['tablet', 'mobile', 'desktop']}
      >
        {products.map((product) => (
          <div className="mr-2" key={product.product_id}>
            <ProductCardConditional 
              product = {product} 
              customNewLabelCSSDesktop = "product-new-label-hotdeal" 
              customDiscountCSSDesktop = "product-new-label-discount-hotdeal"
              customNewLabelCSSMobile = "product-new-label-threeDiv" 
              customDiscountCSSMobile = "product-new-label-discount-threeDiv"
            />
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default HotDealSlider;
