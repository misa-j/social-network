import React, { Component } from "react";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./Post";
import { postActions } from "../../actions/postActions";
import { Dimmer, Loader, Divider, Header, Icon } from "semantic-ui-react";

class Feed extends Component {
  componentDidMount() {
    const { dispatch, posts } = this.props;
    if (!posts.length) {
      dispatch(postActions.fetchPosts({ initialFetch: true }));
    }
  }

  fetchData = () => {
    const { dispatch, posts } = this.props;
    dispatch(
      postActions.fetchPosts({
        initialFetch: false,
        lastId: posts[posts.length - 1]._id
      })
    );
  };

  render() {
    const { loadingUser, posts, totalPosts } = this.props;
    const hasMore = posts.length === totalPosts ? false : true;
    const feedPosts = posts.map(post => (
      <Post key={post._id} post={{ ...post, feed: true }} />
    ));

    return loadingUser ? (
      <Dimmer active>
        <Loader />
      </Dimmer>
    ) : (
      <InfiniteScroll
        dataLength={posts.length} //This is important field to render the next data
        next={this.fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <Divider horizontal>
            <Header as="h4">
              <Icon name="eye" />
              Yay! You have seen it all
            </Header>
          </Divider>
        }
      >
        {feedPosts}
      </InfiniteScroll>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.post.posts,
  totalPosts: state.post.totalPosts,
  loadingUser: state.user.loadingUser
});

export default connect(mapStateToProps)(Feed);
