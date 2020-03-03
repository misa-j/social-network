import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  extractImageFileExtensionFromBase64,
  base64StringtoFile
} from "../reusable/ReusableUtils";
import { Button } from "semantic-ui-react";
import { postActions } from "../actions/postActions";
import { connect } from "react-redux";
import { alertActions } from "../actions/alertActions";

const imageMaxSize = 10485760; // bytes 10MB
const acceptedFileTypes =
  "image/x-png, image/png, image/jpg, image/jpeg, image/gif";
const acceptedFileTypesArray = acceptedFileTypes.split(",").map(item => {
  return item.trim();
});

class PostForm extends PureComponent {
  imagePreviewCanvasRef = React.createRef();
  fileInputRef = React.createRef();
  state = {
    crop: {
      aspect: 1
    }
  };
  //<canvas ref={this.imagePreviewCanvasRef} />
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch(postActions.canvasHasValue(false));
  };

  handleOnCropChange = crop => {
    this.setState({ crop: crop });
  };

  handleOnCropComplete = (crop, pixelCrop) => {
    const {
      post: { imgSrc },
      dispatch
    } = this.props;
    dispatch(postActions.canvasHasValue(true));
    const canvas = this.imagePreviewCanvasRef.current; // document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imgSrc;
    image.onload = function() {
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      const canvasImage = canvas.toDataURL();
      dispatch(postActions.getCroppedSrc(canvasImage));
    };
    //image64toCanvasRef(canvasRef, imgSrc, pixelCrop);
  };

  handleUpload = event => {
    event.preventDefault();
    const { imgSrc } = this.props.post;
    if (imgSrc) {
      const canvasRef = this.imagePreviewCanvasRef.current;
      const { imgSrcExt } = this.props.post;
      const imageData64 = canvasRef.toDataURL("image/" + imgSrcExt);
      const myFilename = "previewFile." + imgSrcExt;
      // file to be uploaded
      const myNewCroppedFile = base64StringtoFile(imageData64, myFilename);
      const fd = new FormData();
      fd.append("photo", myNewCroppedFile, myNewCroppedFile.name);
      fd.append("description", this.state.description);
      const { dispatch } = this.props;
      dispatch(postActions.addPost(fd));
      //this.setState(initialState);
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
    const { dispatch } = this.props;
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

            dispatch(
              postActions.selectImage(
                myResult,
                extractImageFileExtensionFromBase64(myResult)
              )
            );
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

  changeAspect = e => {
    if (e.target.name === "1:1") {
      this.setState({ crop: { ...this.state.crop, aspect: 1 } });
    } else {
      this.setState({ crop: { ...this.state.crop, aspect: 16 / 9 } });
    }
  };

  resetReducer = () => {
    const { dispatch } = this.props;
    dispatch({ type: "RESET_IMAGE" });
  };
  render() {
    const { imgSrc } = this.props.post;

    return (
      <div className="post-crop">
        {imgSrc !== null ? (
          <div>
            <div
              style={{
                padding: "1% 0",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gridColumnGap: "1rem"
              }}
            >
              <div>
                <label className="ui massive fluid icon button">
                  <i className="file icon" />
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
              <div>
                <Button onClick={this.changeAspect} name="1:1" size="massive">
                  1:1
                </Button>
                <Button onClick={this.changeAspect} name="16:9" size="massive">
                  16:9
                </Button>
                <Button
                  onClick={this.resetReducer}
                  icon="close"
                  size="massive"
                />
              </div>
            </div>

            <ReactCrop
              src={imgSrc}
              crop={this.state.crop}
              onComplete={this.handleOnCropComplete}
              onChange={this.handleOnCropChange}
            />

            <canvas
              id="cropped-image-canvas"
              ref={this.imagePreviewCanvasRef}
              style={{ display: "none" }}
            />
          </div>
        ) : (
          <div style={{ padding: "1% 0" }}>
            <label className="ui massive fluid icon button">
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

const mapStateToProps = state => ({
  // logged in user username
  post: state.postUpload
});

export default connect(mapStateToProps)(PostForm);
