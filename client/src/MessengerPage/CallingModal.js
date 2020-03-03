import React, { Component } from "react";
import { connect } from "react-redux";
import { chatActions } from "../actions/chatActions";
import { Button, Modal } from "semantic-ui-react";
import "emoji-mart/css/emoji-mart.css";
import { MediaHandler } from "../_helpers/MediaHandler";
import Peer from "simple-peer";

class CallingModal extends Component {
  constructor() {
    super();

    this.state = {
      hasMedia: false
    };

    this.stream = null;
    this.mediaHandler = new MediaHandler();
  }

  handleOpen = () => {
    const { dispatch, currentRoom, roomId, socket } = this.props;
    this.mediaHandler
      .getPremissions()
      .then(stream => {
        this.setState({ hasMedia: true });
        this.stream = stream;

        this.peer = new Peer({
          initiator: true,
          stream: stream,
          trickle: false
        });

        this.peer.on("error", err => {
          console.log(err);
        });

        this.peer.on("stream", stream => {
          this.userVideo.srcObject = stream;
          this.userVideo.play();
        });

        socket.on("newAnswer", data => {
          this.peer.signal(data.webRtc);
        });

        this.peer.on("signal", webRtc => {
          dispatch(chatActions.call({ currentRoom, roomId, webRtc }));
        });

        this.peer.on("close", () => {
          this.mediaHandler.stopRecoring();
          dispatch(chatActions.endCall());
          this.setState({ hasMedia: false });
        });

        this.myVideo.srcObject = stream;
        this.myVideo.play();
      })
      .catch(e => console.log(e));
  };

  handleClose = () => {
    const { dispatch } = this.props;

    this.peer.destroy();

    this.mediaHandler.stopRecoring();
    dispatch(chatActions.endCall());
    this.setState({ hasMedia: false });
  };

  render() {
    const { callingModal } = this.props;

    return (
      <Modal
        open={callingModal}
        trigger={
          <i
            onClick={this.handleOpen}
            className="fa fa-video-camera"
            aria-hidden="true"
          ></i>
        }
      >
        <Modal.Content>
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
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={this.handleClose}>
            End call
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.user.data._id,
  profilePicture: state.user.data.profilePicture,
  callingModal: state.chat.callingModal,
  socket: state.socket.socket,
  currentRoom: state.chat.currentRoom,
  roomId: state.chat.roomId
});

const connectedCallingModal = connect(mapStateToProps)(CallingModal);
export { connectedCallingModal as CallingModal };
