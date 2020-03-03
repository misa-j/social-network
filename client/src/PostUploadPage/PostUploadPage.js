import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { Component } from "react";
import { connect } from "react-redux";

import { Icon, Button, Message } from "semantic-ui-react";

import PostForm from "../components/PostForm";
import { Map } from "../components/Map";
import { AddPostTextArea } from "../components/AddPostTextArea";

import { AddTagsToImage } from "../components/AddTagsToImage";
import Messages from "../components/Messages";

function FirstStep() {
  return <PostForm />;
}
// <div className="loading">Loading&#8230;</div>
function SecondtStep({ cropImgSrc, message }) {
  return (
    <div className="edit-post">
      {message}
      <AddTagsToImage cropImgSrc={cropImgSrc} />
      <div>
        <Message size="large" color="blue">
          Click on image to tag people
        </Message>
      </div>

      <div>
        <Map />
      </div>
      <div>
        <Message size="large" color="blue">
          Type @ to get suggestions
        </Message>
        <AddPostTextArea />
      </div>
    </div>
  );
}

class PostUploadPage extends Component {
  state = {
    step: 0
  };

  componentDidMount = () => {
    document.title = "Upload | social-network";
  };

  handlePreviousClick = () => {
    const { dispatch } = this.props;
    dispatch({ type: "PREVIOUS_PAGE" });
  };

  handleNextClick = () => {
    const { dispatch } = this.props;

    dispatch({ type: "NEXT_PAGE" });
  };

  render() {
    let stepComponent = null;

    const { canvasHasValue, cropImgSrc, step, uploading } = this.props.post;
    const { alert } = this.props;

    if (step === 0) {
      stepComponent = <FirstStep />;
    } else if (step === 1) {
      stepComponent = <SecondtStep cropImgSrc={cropImgSrc} />;
    }
    return (
      <div className="container">
        {uploading ? (
          <div className="fullscreen-loader">Loading&#8230;</div>
        ) : null}
        {alert.type ? <Messages alert={alert} /> : null}

        {stepComponent}

        {step === 1 ? (
          <Button
            style={{ marginBottom: "30px" }}
            icon
            labelPosition="left"
            size="huge"
            fluid
            onClick={this.handlePreviousClick}
          >
            Previous
            <Icon name="left arrow" />
          </Button>
        ) : null}
        {canvasHasValue && step === 0 ? (
          <Button
            icon
            labelPosition="right"
            size="huge"
            fluid
            onClick={this.handleNextClick}
          >
            Next
            <Icon name="right arrow" />
          </Button>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  post: state.postUpload,
  alert: state.alert
});

const connectedPostUploadPage = connect(mapStateToProps)(PostUploadPage);
export { connectedPostUploadPage as default };
