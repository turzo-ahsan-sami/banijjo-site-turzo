import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  get_customer_info,
  upload_customer_photo,
} from "../../redux/customer-profile/customer-actions";

import ProfilePageNav from "./profile-nav";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;
const img_src = `${fileUrl}/upload/customerPhoto/`;

const mapState = (state) => ({
  customer_profile: state.customer.profile,
});

class ViewProfile extends Component {
  state = {
    file: "",
    file_name: "",
    // uploaded_file: null
  };

  componentDidMount() {
    if (localStorage.hasOwnProperty("customer_id")) {
      this.props.get_customer_info(localStorage.getItem("customer_id"));
    } else {
      this.props.history.push("/");
    }
  }

  onChangeHandler = (e) => {
    this.setState({
      file: e.target.files[0],
      file_name: e.target.files[0].name,
    });
  };

  onSubmitHandler = async (e) => {
    e.preventDefault();
    const form_data = new FormData();
    form_data.append("file", this.state.file);

    try {
      const res = await axios.post(
        `${base}/api/upload_customer_profile_photo`,
        form_data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const { file_name, file_path } = res.data;
      await axios.post(
        `${base}/api/set_profile_photo`,
        { file_name, customer_id: this.props.customer_profile.id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // this.setState({ uploaded_file: res.data });
      this.props.upload_customer_photo(file_name);
    } catch (err) {
      if (err.response.status === 500) {
        alert("Problem with Server");
      } else {
        alert(err.response.data.msg);
      }
    }
  };

  render() {
    const {
      id,
      name,
      email,
      address,
      profile_pic,
      phone_number,
      city,
      district,
      area,
      thana,
      zipcode
    } = this.props.customer_profile;

    console.log('this.props.customer_profile...', this.props.customer_profile);
    // const { uploaded_file } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-12">
            <ProfilePageNav />
          </div>

          <div className="col-lg-9 col-md-12">
            <Fragment>
              <h3>View Profile</h3>
              <table className="hover unstriped stack">
                <tbody>
                  <tr>
                    <td colSpan="2">
                      <div className="row">
                        <div className="col-md-12">
                          {profile_pic !== null ? (
                            <img
                              // src={`/image/profilePic/${profile_pic}`}
                              src={`${img_src}${profile_pic}`}
                              alt="profile-photo"
                              title={
                                name !== null ? name : "Default_Profile_Pic"
                              }
                              width={150}
                            />
                          ) : (
                            <img
                              src="https://via.placeholder.com/150"
                              alt="profile-photo"
                              title="Mehedi Hasan"
                              width={150}
                            />
                          )}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <form onSubmit={this.onSubmitHandler}>
                            <div className="form-group">
                              {/*<label htmlFor="exampleInputFile">File input</label>*/}
                              <input
                                type="file"
                                id="exampleInputFile"
                                onChange={this.onChangeHandler}
                              />
                            </div>
                            <button type="submit" className="btn btn-default">
                              Upload Profile Picture
                            </button>
                          </form>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th width="200">Name</th>
                    <td>{name !== null ? name : ""}</td>
                  </tr>
                  <tr>
                    <th width="200">Email</th>
                    <td>{email !== null ? email : ""}</td>
                  </tr>
                  <tr>
                    <th width="200">Phone no</th>
                    <td>{phone_number !== null ? phone_number : ""}</td>
                  </tr>
                  <tr>
                    <th width="200">Address</th>
                    <td>{address !== null ? address : ""}</td>
                  </tr>
                  <tr>
                    <th width="200">Area</th>
                    <td>{area ? area : ""}</td>
                  </tr>
                  <tr>
                    <th width="200">Thana</th>
                    <td>{thana ? thana : ""}</td>
                  </tr>
                  <tr>
                    <th width="200">City</th>
                    <td>{city ? city : ""}</td>
                  </tr>
                  <tr>
                    <th width="200">District</th>
                    <td>{district ? district : ""}</td>
                  </tr>
                  <tr>
                    <th width="200">Zipcode</th>
                    <td>{zipcode ? zipcode : ""}</td>
                  </tr>
                </tbody>
              </table>
            </Fragment>
          </div>
        </div>
      </div>
    );
  }
}

/*const actions = dispatch => ({
  get_customer_info: customer_id => dispatch(get_customer_info(customer_id))
});*/

export default connect(mapState, { get_customer_info, upload_customer_photo })(
  ViewProfile
);

// export default ViewProfile;
