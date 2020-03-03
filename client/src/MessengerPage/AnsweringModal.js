import React, { Component, Fragment } from "react";
import { Image, Modal, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { chatActions } from "../actions/chatActions";
import Peer from "simple-peer";
import { MediaHandler } from "../_helpers/MediaHandler";

class AnsweringModal extends Component {
  constructor() {
    super();

    this.state = {
      hasMedia: false
    };

    this.stream = null;
    this.mediaHandler = new MediaHandler();
  }

  handeAnswer = () => {
    const { dispatch, answeringModal } = this.props;

    this.mediaHandler.getPremissions().then(stream => {
      this.setState({ hasMedia: true });
      this.stream = stream;

      this.peer = new Peer({ stream });

      this.peer.on("error", err => {
        console.log(err);
      });

      this.peer.signal(answeringModal.webRtc);

      this.peer.on("stream", stream => {
        this.userVideo.srcObject = stream;
        this.userVideo.play();
      });

      this.peer.on("signal", webRtc => {
        dispatch(
          chatActions.answer({ roomId: answeringModal.room._id, webRtc })
        );
      });

      this.peer.on("close", () => {
        this.mediaHandler.stopRecoring();
        dispatch(chatActions.endAnsweringCall());
        this.setState({ hasMedia: false });
      });

      this.myVideo.srcObject = stream;
      this.myVideo.play();
    });
  };

  handleClose = () => {
    const { dispatch } = this.props;

    this.peer.destroy();

    this.mediaHandler.stopRecoring();
    this.setState({ hasMedia: false });
    dispatch(chatActions.endAnsweringCall());
  };

  render() {
    const { answeringModal } = this.props;
    const { hasMedia } = this.state;
    return (
      <Fragment>
        <Modal open={answeringModal.isOpen}>
          <Modal.Content image>
            {!hasMedia ? (
              <Image
                wrapped
                size="medium"
                src={
                  "http://localhost:5000/images/profile-picture/" +
                  answeringModal.caller.profilePicture
                }
              />
            ) : null}
            <Modal.Description>
              <video
                style={{
                  width: 300,
                  height: "auto"
                }}
                ref={ref => {
                  this.myVideo = ref;
                }}
              ></video>
              <video
                style={{
                  width: 300,
                  height: "auto"
                }}
                ref={ref => {
                  this.userVideo = ref;
                }}
              ></video>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button negative onClick={this.handleClose}>
              Decline
            </Button>
            <Button onClick={this.handeAnswer} positive content="Answer" />
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  notifications: state.notification.notifications,
  answeringModal: state.chat.answeringModal,
  currentRoom: state.chat.currentRoom,
  roomId: state.chat.roomId
});

const connectAnsweringModal = connect(mapStateToProps)(AnsweringModal);
export { connectAnsweringModal as AnsweringModal };
