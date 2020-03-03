import React, { Fragment } from "react";
import { Icon, Comment, Modal, List } from "semantic-ui-react";
import { commentActions } from "../../actions/commentActions";
import { connect } from "react-redux";
import FollowingFollowerList from "../FollowingFollowerList";

const LikeComment = ({
  dispatch,
  comment: { commentId, likes, authorId },
  commentLikes,
  post: { postId },
  commentLikeList
}) => {
  const handleCommentLike = () => {
    dispatch(
      commentActions.likeComment({
        commentId,
        authorId,
        postId,
        commentLikes
      })
    );
  };
  const getCommentLikes = () => {
    dispatch(commentActions.getCommentLikes(commentId));
  };

  const handleClose = () => {
    dispatch({ type: "CLEAR_COMMENT_LIKES" });
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
        {commentLikes.some(e => e === commentId) ? (
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
  commentLikes: state.user.data.commentLikes,
  commentLikeList: state.comments.commentLikes
});

export default connect(mapStateToProps)(LikeComment);
