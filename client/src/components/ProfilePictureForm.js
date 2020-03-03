import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  image64toCanvasRef,
  extractImageFileExtensionFromBase64,
  base64StringtoFile
} from "../reusable/ReusableUtils";
import { Button } from "semantic-ui-react";
import { postActions } from "../actions/postActions";
import { connect } from "react-redux";
import { alertActions } from "../actions/alertActions";

const imageMaxSize = 10000000; // bytes
const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray = acceptedFileTypes.split(",").map(item => {
  return item.trim();
});

const initialState = {
  description: "",
  imgSrc: null,
  imgSrcExt: null,
  imageUploadEndpoint: "",
  crop: {
    aspect: 1
  }
};

class ProfilePictureForm extends PureComponent {
  imagePreviewCanvasRef = React.createRef();
  fileInputRef = React.createRef();
  state = initialState;

  handleChange = e => {
    this.setState({
      description: e.target.value
    });
  };

  handleOnCropChange = crop => {
    this.setState({ crop: crop });
  };

  handleOnCropComplete = (crop, pixelCrop) => {
    const canvasRef = this.imagePreviewCanvasRef.current;
    const { imgSrc } = this.state;
    image64toCanvasRef(canvasRef, imgSrc, pixelCrop);
  };

  handleUpload = event => {
    event.preventDefault();
    const { imgSrc } = this.state;
    if (imgSrc) {
      const canvasRef = this.imagePreviewCanvasRef.current;
      const { imgSrcExt } = this.state;
      const imageData64 = canvasRef.toDataURL("image/" + imgSrcExt);
      const myFilename = "previewFile." + imgSrcExt;
      // file to be uploaded
      const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);
      const fd = new FormData();
      fd.append("photo", myNewCroppedFile, myNewCroppedFile.name);

      fd.append("description", this.state.description);
      const { dispatch } = this.props;
      dispatch(postActions.addProfiePicture(fd));
      this.setState(initialState);
    }
  };

  verifyFile = files => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      const { dispatch } = this.props;
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        dispatch(
          alertActions.error(
            "This file is not allowed. Only images are allowed."
          )
        );

        return false;
      }

      if (currentFileSize > imageMaxSize) {
        dispatch(
          alertActions.error(
            "This file is not allowed. " +
              currentFileSize +
              " bytes is too large"
          )
        );
        return false;
      }
      return true;
    }
  };

  handleFileSelect = event => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        // imageBase64Data
        const currentFile = files[0];
        const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener(
          "load",
          () => {
            // console.log(myFileItemReader.result)
            const myResult = myFileItemReader.result;
            this.setState({
              imgSrc: myResult,
              imgSrcExt: extractImageFileExtensionFromBase64(myResult)
            });
          },
          false
        );

        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  render() {
    const { imgSrc } = this.state;
    return (
      <div>
        {imgSrc !== null ? (
          <div>
            <div style={{ marginBottom: "1%" }}>
              <label className="ui icon button fluid">
                <i className="file icon " />
                Change Image
                <input
                  style={{ display: "none" }}
                  ref={this.fileInputRef}
                  type="file"
                  accept={acceptedFileTypes}
                  multiple={false}
                  onChange={this.handleFileSelect}
                />
              </label>
            </div>

            <ReactCrop
              src={imgSrc}
              crop={this.state.crop}
              onComplete={this.handleOnCropComplete}
              onChange={this.handleOnCropChange}
            />
            <Button primary fluid onClick={this.handleUpload}>
              Upload
            </Button>
            <canvas
              style={{ display: "none" }}
              ref={this.imagePreviewCanvasRef}
            />
          </div>
        ) : (
          <div>
            <label className="ui icon button fluid">
              <i className="file icon" />
              Select Image
              <input
                style={{ display: "none" }}
                ref={this.fileInputRef}
                type="file"
                accept={acceptedFileTypes}
                multiple={false}
                onChange={this.handleFileSelect}
              />
            </label>
          </div>
        )}
      </div>
    );
  }
}

export default connect()(ProfilePictureForm);
