import { Component } from "react";

class NotFoundPage extends Component {
  componentDidMount = () => {
    document.title = "Page not found | social-network";
  };

  render() {
    return (
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "120px",
            fontSize: "6rem",
            color: "#e74c3c",
            borderRadius:"4px",
            padding:"4px",
            backgroundColor:"black"
          }}
        >
          &#10060;
        </div>
        <div
          style={{
            fontSize: "4rem",
            fontWeight: "900",
            color: "#262626",
            fontFamily: "sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Page Not Found
        </div>
      </div>
    );
  }
}

export { NotFoundPage as default };
