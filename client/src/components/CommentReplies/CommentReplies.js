import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Comment, Icon, Button, Divider } from "semantic-ui-react";
import { commentActions } from "../../actions/commentActions";
import CommentReply from "./CommentReply";

class CommentReplies extends Component {
  state = {
    collapsed: true
  };

  handleCheckbox = () => {
    const {
      dispatch,
      replies,
      comment: { commentId }
    } = this.props;
    if (!replies[commentId].comments.length && !replies[commentId].fetching) {
      dispatch(
        commentActions.getPostCommentReplies(commentId, {
          initialFetch: true
        })
      );
    }
    this.setState({ collapsed: !this.state.collapsed });
  };

  fetchReplies = () => {
    const {
      dispatch,
      replies,
      comment: { commentId }
    } = this.props;

    if (!replies[commentId].fetching) {
      const lastId =
        replies[commentId].comments[replies[commentId].comments.length - 1]._id;
      dispatch(
        commentActions.getPostCommentReplies(commentId, {
          initialFetch: false,
          lastId
        })
      );
    }
  };

  render() {
    const { collapsed } = this.state;
    const {
      replies,
      comment: { commentId, repliesNum },
      post
    } = this.props;
    let comments = null;
    const hasMore =
      repliesNum === replies[commentId].comments.length ? false : true;
    const fetching = replies[commentId].fetching;

    if (replies[commentId].comments.length) {
      comments = replies[commentId].comments.map(comment => {
        return <CommentReply key={comment._id} comment={comment} post={post} />;
      });
    }

    return (
      <Fragment>
        {repliesNum !== 0 ? (
          <div
            onClick={() => this.handleCheckbox()}
            style={{ cursor: "pointer", margin: "20px 0 20px" }}
          >
            <Icon name="arrow down" />{" "}
            {collapsed ? repliesNum + " replies" : "Show less"}
          </div>
        ) : null}
        <Comment.Group collapsed={collapsed}>
          {comments}
          {hasMore ? (
            <Fragment>
              <Divider></Divider>
              <Button loading={fetching} onClick={this.fetchReplies}>
                Load {repliesNum - replies[commentId].comments.length} more
              </Button>
            </Fragment>
          ) : null}
        </Comment.Group>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  replies: state.replies
});

export default connect(mapStateToProps)(CommentReplies);
