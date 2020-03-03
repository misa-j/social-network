import React, { Component } from "react";
import { connect } from "react-redux";
import { postActions } from "../actions/postActions";
import Post from "../components/Post/Post";
import Messages from "../components/Messages";

class PostPage extends Component {
  componentDidMount = () => {
    const { match, dispatch } = this.props;
    dispatch(postActions.getPost(match.params.postId));
  };

  render() {
    const { post, loadingUser, alert } = this.props;
    if (alert.type) {
      return (
        <div className="container">
          <Messages alert={alert} />
        </div>
      );
    } else {
      return (
        <div className="container">
          {!post.fetching && !loadingUser ? <Post post={post} /> : null}
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  post: state.post.post,
  loadingUser: state.user.loadingUser,
  alert: state.alert
});

const connectedHomePage = connect(mapStateToProps)(PostPage);
export { connectedHomePage as default };
