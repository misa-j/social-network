import React, { Component } from "react";

import { connect } from "react-redux";

import { MessengerSidePanel } from "./MessengerSidePanel";
import { MessengerContent } from "./MessengerContent";

class MessengerPage extends Component {
  componentDidMount = () => {
    document.title = "Messages | social-network";
  };

  render() {
    const { chat, roomId } = this.props;
    return (
      <div id="frame">
        <MessengerSidePanel></MessengerSidePanel>
        {chat.currentRoom ? (
          <MessengerContent
            content={chat[roomId]}
            key={roomId}
          ></MessengerContent>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  roomId: state.chat.roomId,
  chat: state.chat
});

const connectedMessengerPage = connect(mapStateToProps)(MessengerPage);
export { connectedMessengerPage as default };
