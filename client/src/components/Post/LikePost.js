import React, { Fragment } from "react";
import { Icon, Modal, List } from "semantic-ui-react";
import { postActions } from "../../actions/postActions";
import { connect } from "react-redux";
import FollowingFollowerList from "../FollowingFollowerList";

const LikePost = ({
  dispatch,
  post: { postId, likes, authorId },
  postLikes,
  postLikeList
}) => {
  const handlePostLike = () => {
    dispatch(postActions.likePost(postId, authorId, postLikes));
  };

  const getPostLikes = () => {
    dispatch(postActions.getPostLikes(postId));
  };

  const handleClose = () => {
    dispatch({ type: "CLEAR_POST_LIKES" });
  };

  const list = postLikeList.length
    ? postLikeList.map(({ author }) => (
        <FollowingFollowerList
          key={author._id}
          user={author}
        ></FollowingFollowerList>
      ))
    : null;

  return (
    <Fragment>
      {postLikes.some(e => e === postId) ? (
        <Icon
          onClick={handlePostLike}
          style={{ color: "#ed4956", cursor: "pointer" }}
          name="heart"
          className="heart-icon"
        />
      ) : (
        <Icon
          onClick={handlePostLike}
          style={{ cursor: "pointer" }}
          name="heart outline"
          className="heart-icon"
        />
      )}

      <Modal
        trigger={
          <span style={{ cursor: "pointer" }} onClick={getPostLikes}>
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
    </Fragment>
  );
};

const mapStateToProps = state => ({
  postLikes: state.user.data.postLikes,
  postLikeList: state.post.postLikes
});

export default connect(mapStateToProps)(LikePost);
