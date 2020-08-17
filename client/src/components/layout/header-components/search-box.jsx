import React, { Component } from 'react';

class SearchBox extends Component {
  state = {
    searchKeyText: '',
  };

  onChangeHandler = e => {
    e.preventDefault();
    this.setState({ searchKeyText: e.target.value });
    // window.location.href = '/search/' + this.state.searchKeyText;
  };

  onSubmitHandler = e => {
    e.preventDefault();
    window.location.href = '/search/' + this.state.searchKeyText;
  };

  render() {
    return (
      <>
        <form onSubmit={this.onSubmitHandler}>
          <div className="search-box">
            <input
              className="custom-input"
              type="text"
              name="searchKey"
              placeholder="Search..."
              onChange={this.onChangeHandler}
              value={this.state.searchKeyText}
            />
            <button type="submit">
              <i className="fas fa-search search-icon" />
            </button>
          </div>
        </form>
      </>
    );
  }
}

export default SearchBox;
