import React from "react";
import { Comment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import LikeCommetReply from "./LikeCommetReply";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
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
    target: {
      url: "_blank"
    }
  }
};

const CommentReply = ({ username, comment, post: { postId, photo } }) => {
  return (
    <Comment>
      <Comment.Avatar
        src={`/images/profile-picture/100x100/${comment.author[0].profilePicture}`}
      />
      <Comment.Content>
        <Comment.Author
          as={Link}
          to={
            comment.author[0].username === username
              ? "/profile"
              : "/" + comment.author[0].username
          }
        >
          {comment.author[0].firstName + " " + comment.author[0].lastName}
        </Comment.Author>
        <Comment.Metadata>
          <div>{dayjs(comment.createdAt).fromNow()}</div>
        </Comment.Metadata>
        <Comment.Text style={{ whiteSpace: "pre-line" }}>
          <Linkify options={linkifyOptions}>{comment.text}</Linkify>
        </Comment.Text>
        <Comment.Actions>
          <LikeCommetReply
            comment={{
              commentId: comment._id,
              commentText: comment.text,
              likes: comment.likes,
              authorId: comment.author[0]._id,
              commentAt: comment.commentAt
            }}
            post={{
              postId,
              photo
            }}
          />
        </Comment.Actions>
      </Comment.Content>
    </Comment>
  );
};

const mapStateToProps = state => ({
  // logged in user username
  username: state.user.data.username
});

export default connect(mapStateToProps)(CommentReply);
