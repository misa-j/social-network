import React from "react";
import { Popup } from "semantic-ui-react";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
import { history } from "../_helpers/history";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

hashtag(linkify);
mention(linkify);

const linkifyOptions = {
  formatHref: function(href, type) {
    if (type === "hashtag") {
      href = "/hashtags/" + href.substring(1);
    }
    if (type === "mention") {
      href = "/" + href.substring(1);
    }
    return href;
  },
  attributes: {
    onClick: event => {
      event.preventDefault();
      history.push(event.target.pathname);
    }
  },
  target: {
    url: "_blank"
  }
};

const MessengerMessages = ({
  message,
  userId,
  profilePicture,
  currentRoom
}) => {
  if (message.sender === userId) {
    if (message.sent === false) {
      return (
        <li className="replies" key={message.uuid}>
          <img
            src={`/images/profile-picture/100x100/${profilePicture}`}
            alt=""
          />
          <p
            style={{
              backgroundColor: "#f5f5f5",
              color: "black",
              border: "1px solid grey",
              wordWrap: "break-word"
            }}
          >
            <Linkify options={linkifyOptions}>{message.value}</Linkify>
          </p>
        </li>
      );
    }
    if (message.messageType === "text") {
      return (
        <li className="replies">
          <img
            src={`/images/profile-picture/100x100/${profilePicture}`}
            alt=""
          />
          <Popup
            content={
              dayjs(message.createdAt).fromNow() + ", seen:" + message.read
            }
            trigger={
              <p>
                <Linkify options={linkifyOptions}>{message.text}</Linkify>
              </p>
            }
          />
        </li>
      );
    } else {
      return (
        <li className="replies">
          <img
            src={`/images/profile-picture/100x100/${profilePicture}`}
            alt=""
          />
          <Popup
            content={
              dayjs(message.createdAt).fromNow() + ", seen:" + message.read
            }
            trigger={
              <img
                style={{
                  borderRadius: "3%",
                  objectFit: "cover",
                  width: "40%",
                  height: "20%"
                }}
                src={`/images/chat-images/${message.photo}`}
                alt=""
              />
            }
          />
        </li>
      );
    }
  } else {
    if (message.sent === false) {
      return (
        <li className="sent" key={message.uuid}>
          <img
            src={`/images/profile-picture/100x100/${currentRoom.user.profilePicture}`}
            alt=""
          />
          <p
            style={{
              backgroundColor: "#f5f5f5",
              color: "black",
              border: "1px solid grey",
              wordWrap: "break-word"
            }}
          >
            <Linkify options={linkifyOptions}>{message.value}</Linkify>
          </p>
        </li>
      );
    }
    if (message.messageType === "text") {
      return (
        <li className="sent">
          <img
            src={`/images/profile-picture/100x100/${currentRoom.user.profilePicture}`}
            alt=""
          />
          <Popup
            content={
              dayjs(message.createdAt).fromNow() + ", seen:" + message.read
            }
            trigger={
              <p>
                {" "}
                <Linkify options={linkifyOptions}>{message.text}</Linkify>
              </p>
            }
          />
        </li>
      );
    } else {
      return (
        <li className="sent">
          <img
            src={`/images/profile-picture/100x100/${currentRoom.user.profilePicture}`}
            alt=""
          />
          <Popup
            content={
              dayjs(message.createdAt).fromNow() + ", seen:" + message.read
            }
            trigger={
              <img
                style={{
                  borderRadius: "3%",
                  objectFit: "cover",
                  width: "40%",
                  height: "20%"
                }}
                src={`/images/chat-images/${message.photo}`}
                alt=""
              />
            }
          />
        </li>
      );
    }
  }
};

export default MessengerMessages;
