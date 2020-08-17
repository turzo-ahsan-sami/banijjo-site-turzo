import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProductCard from '../../components/shared/product-card';
import ProductCardConditional from '../../components/shared/product-card-conditional';

const SameVendorOrSameCatProducts = ({ vorc, id, products }) => {

  const [otherProducts, setOtherProducts] = useState([]);
  const [visibleDesk, setVisibleDesk] = useState(5);
  const [otherProductsDesk, setOtherProductsDesk] = useState([]);

  
  useEffect(() => {
    setOtherProducts(products);
    if(products.length > 0){ 
      setOtherProductsDesk([...products.slice(0, 5)]);
    }
  }, [products]);


  const fetchMoreDataDesk = () => {
    setTimeout(() => {
      setOtherProductsDesk([
        ...otherProductsDesk,
        ...otherProducts.slice(visibleDesk, visibleDesk + 5),
      ]);
      setVisibleDesk(visibleDesk + 5);
    }, 300);
  };

  return (
    <>
      {vorc === 'c' && (
        <div className="row">
          <div className="col-12">
            <h1 className="h5 float-left">Similar Products</h1>
            <div className="float-right see-more">
              <a href={`/productList/${id}`}>
                <span className="seeMore">See more</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {vorc === 'v' && (
        <div className="row">
          <div className="col-12">
            <h1 className="h5 float-left">Similar Brands</h1>
            <div className="float-right see-more">
              <a href={`/vendor/${id}`}>
                <span className="seeMore">See more</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <InfiniteScroll
          dataLength={otherProductsDesk.length}
          next={fetchMoreDataDesk}
          hasMore={true}
        >
          {otherProductsDesk.map((product) => (
            <div
              className="col-md-5ths mb-3 custom-fade-in"
              key={product.product_id}
            >
              {/* <ProductCard product={product} /> */}
              <ProductCardConditional 
                product = {product} 
                customNewLabelCSSDesktop = "product-new-label-others" 
                customDiscountCSSDesktop = "product-new-label-discount-others"
                customNewLabelCSSMobile = "product-new-label-twoDiv" 
                customDiscountCSSMobile = "product-new-label-discount-twoDiv"
              />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default SameVendorOrSameCatProducts;
