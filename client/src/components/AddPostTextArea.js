import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Button, Form } from "semantic-ui-react";
import { postActions } from "../actions/postActions";
import { base64StringtoFile } from "../reusable/ReusableUtils";
import TextInput from "react-autocomplete-input";
import "react-autocomplete-input/dist/bundle.css";
import { debounce } from "throttle-debounce";

function searchUser(q) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ q })
  };

  return fetch("/api/user/searchByUsername", requestOptions).then(res => {
    return res;
  });
}

class AddPostTextArea extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      part: "",
      suggestions: []
    };

    this.debouncedRequestOptions = debounce(500, this.handleRequestOptions);
  }

  handleChange = value => {
    this.setState({ value });
  };

  handleSubmit = () => {
    const { dispatch, imgSrcExt, cropImgSrc, location, divs } = this.props;
    const imageData64 = cropImgSrc;
    const myFilename = "image." + imgSrcExt;
    const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);
    const fd = new FormData();
    fd.append("photo", myNewCroppedFile, myNewCroppedFile.name);
    fd.append("description", this.state.value);
    fd.append("tags", JSON.stringify(divs));
    Object.keys(location).forEach(key => fd.append(key, location[key]));

    dispatch(postActions.addPost(fd));
  };

  // text in input is "I want @ap"
  handleRequestOptions = part => {
    this.setState({ part });
    // console.log(part); // -> "ap", which is part after trigger "@"
    if (part !== "") {
      searchUser(part).then(response => {
        if (part === this.state.part) {
          response.json().then(results => {
            this.setState({
              isLoading: false,
              suggestions: results.users.map(user => user.username)
            });
          });
        } else {
          // Ignore suggestions if input value changed
          this.setState({
            isLoading: false
          });
        }
      });
    }
  };

  render() {
    const { value, suggestions } = this.state;
    return (
      <Fragment>
        <Form size="big" onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Description</label>
            <TextInput
              maxOptions={8}
              offsetY={20}
              minChars={1}
              value={value}
              onRequestOptions={this.debouncedRequestOptions}
              options={suggestions}
              onChange={this.handleChange}
              placeholder="Description"
              type="textarea"
              name="description"
              style={{ minHeight: 100, maxHeight: 100 }}
            />
          </Form.Field>

          <Button primary fluid size="big">
            Upload
          </Button>
        </Form>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { imgSrcExt, cropImgSrc, location, divs } = state.postUpload;
  return {
    imgSrcExt,
    cropImgSrc,
    location,
    divs
  };
};

const connectedAddPostTextArea = connect(mapStateToProps)(AddPostTextArea);
export { connectedAddPostTextArea as AddPostTextArea };
