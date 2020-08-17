import React from 'react';
import Carousel from 'react-multi-carousel';
import ProductCard from '../shared/product-card';
import ProductCardSM from '../shared/product-card-sm';

const CustomLeftArrow = () => <i></i>;

const SubSlider = ({ products }) => {
  return (
    <>
      <Carousel
        additionalTransfrom={1}
        arrows
        autoPlay
        autoPlaySpeed={5000}
        centerMode={false}
        className=""
        containerClass=""
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomLeftArrow />}
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
            items: 7,
          },
          tablet: {
            breakpoint: {
              max: 991.98,
              min: 576,
            },
            items: 6,
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
      >
        {products.map((product) => (
          <div className="mt-2 mr-2 ml-1" key={product.product_id}>
            <ProductCardSM product={product} />
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default SubSlider;
