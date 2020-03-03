import React, { Fragment } from "react";
import { Icon, Comment, Modal, List } from "semantic-ui-react";
import { commentActions } from "../../actions/commentActions";
import { connect } from "react-redux";
import FollowingFollowerList from "../FollowingFollowerList";

const LikeCommentReply = ({
  dispatch,
  comment: { commentId, likes, commentAt, authorId },
  post: { postId },
  commentReplyLikes,
  commentLikeList
}) => {
  const handleCommentLike = () => {
    dispatch(
      commentActions.likeCommentReply({
        commentId,
        commentAt,
        authorId,
        postId,
        commentReplyLikes
      })
    );
  };

  const getCommentLikes = () => {
    dispatch(commentActions.getCommentReplyLikes(commentId));
  };

  const handleClose = () => {
    dispatch({ type: "CLEAR_COMMENT_REPLY_LIKES" });
  };

  const list = commentLikeList.length
    ? commentLikeList.map(({ author }) => (
        <FollowingFollowerList
          key={author._id}
          user={author}
        ></FollowingFollowerList>
      ))
    : null;

  return (
    <Fragment>
      <Modal
        trigger={
          <span
            style={{ cursor: "pointer", marginRight: "3px" }}
            onClick={getCommentLikes}
          >
            {likes}
          </span>
        }
        onClose={handleClose}
      >
        <Modal.Header>Likes</Modal.Header>
        <Modal.Content scrolling>
          <Modal.Description>
            <List verticalAlign="middle" size="huge">
              {list}
            </List>
          </Modal.Description>
        </Modal.Content>
      </Modal>
      <Comment.Action onClick={handleCommentLike}>
        {commentReplyLikes.some(e => e === commentId) ? (
          <Icon style={{ color: "#ed4956" }} name="heart" />
        ) : (
          <Icon name="heart" />
        )}
        Like
      </Comment.Action>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  commentReplyLikes: state.user.data.commentReplyLikes,
  commentLikeList: state.replies.commentLikes
});

export default connect(mapStateToProps)(LikeCommentReply);
