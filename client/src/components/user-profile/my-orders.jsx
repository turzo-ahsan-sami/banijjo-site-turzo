import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import { get_order_history } from "../../redux/customer-profile/customer-actions";

import ProfilePageNav from "./profile-nav";

const mapState = (state) => ({
  order_history: state.customer.order_history,
});

class MyOrders extends Component {
  componentDidMount() {
    if (localStorage.hasOwnProperty("customer_id")) {
      this.props.get_order_history(localStorage.getItem("customer_id"));
    }
  }

  formatDate(string){
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(string).toLocaleDateString([],options);
  }

  render() {
    const { order_history } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-12">
            <ProfilePageNav />
          </div>

          <div className="col-lg-9 col-md-12">
            <Fragment>
              <h3>My Orders</h3>
              {order_history.length > 0 ? (
                <table className="hover unstriped stack table-bordered">
                  <thead>
                    <tr>
                      <th width="120">Order No #</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Total Amount</th>
                      <th>Shipping Address</th>
                      <th>Status</th>
                      <th>Order Date</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "14px" }}>
                    {order_history.map((el) => (
                      <tr>
                        <td>{el.id}</td>
                        <td>{el.product_name}</td>
                        <td>{el.quantity}</td>
                        <td>{el.order_amount}</td>
                        <td>{el.shipping_address}</td>
                        <td>{el.status}</td>
                        <td>{el.order_time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: "red" }}>No Orders to Show</p>
              )}
            </Fragment>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapState, { get_order_history })(MyOrders);
