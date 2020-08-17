import React, { Component } from 'react';

class ScrollToTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_visible: false,
    };
  }

  componentDidMount() {
    var scrollComponent = this;
    document.addEventListener('scroll', function (e) {
      scrollComponent.toggleVisibility();
    });
  }

  toggleVisibility() {
    if (window.pageYOffset > 300) {
      this.setState({
        is_visible: true,
      });
    } else {
      this.setState({
        is_visible: false,
      });
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  render() {
    const { is_visible } = this.state;
    return (
      <>
        <div className="scroll-to-top">
          {is_visible && (
            <div
              onClick={() => this.scrollToTop()}
              style={{ opacity: '.7' }}
              className="round-button"
            >
              <i
                className="fa fa-chevron-up fa-2x"
                style={{ paddingBottom: '3px' }}
              />
            </div>
          )}
        </div>

        <style jsx="true">{`
          .scroll-to-top {
            position: fixed;
            right: 2%;
            bottom: 8%;
            cursor: pointer;
            z-index: 1000;
            animation: fadeIn 700ms ease-in-out 1s both;
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          .round-button {
            color: rgba(255, 0, 0, 0.8);
            padding: 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            border-radius: 50%;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
          }
        `}</style>
      </>
    );
  }
}

export default ScrollToTop;
