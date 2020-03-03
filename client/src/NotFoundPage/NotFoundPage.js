import React, { Component } from "react";

class NotFoundPage extends Component {
  componentDidMount = () => {
    document.title = "Page not found | social-network";
  };

  render() {
    return (
      <div className="container">
        <div
          style={{
            fontSize: "4rem",
            fontWeight: "900",
            color: "#262626"
          }}
        >
          Page Not Found
        </div>
      </div>
    );
  }
}

export { NotFoundPage as default };
