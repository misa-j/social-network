import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { postActions } from "../actions/postActions";
import Messages from "../components/Messages";
import InfiniteScroll from "react-infinite-scroll-component";

class HashtagPage extends Component {
  componentDidMount = () => {
    const {
      dispatch,
      match,
      data: { hashtag }
    } = this.props;
    if (hashtag !== match.params.hashtag) {
      dispatch(
        postActions.getPostsByHashtag(match.params.hashtag, {
          initialFetch: true
        })
      );
    }
    document.title = "Hashtag Page | social-network";
  };

  fetchData = () => {
    const {
      dispatch,
      data: { postsByHashtag },
      match
    } = this.props;
    const lastId = postsByHashtag[postsByHashtag.length - 1]._id;
    dispatch(
      postActions.getPostsByHashtag(match.params.hashtag, {
        initialFetch: false,
        lastId
      })
    );
  };

  render() {
    const {
      data: { postsByHashtag, totalPostsByHashtag },
      alert,
      match
    } = this.props;
    const hasMore =
      postsByHashtag.length === totalPostsByHashtag ? false : true;
    const hashtagPosts = postsByHashtag.map(post => {
      return (
        <Link to={"/p/" + post._id} key={post._id}>
          <div className="gallery-item">
            <img
              src={`/images/post-images/thumbnail/${post.photo}`}
              className="gallery-image"
              alt=""
            />

            <div className="gallery-item-info">
              <ul>
                <li className="gallery-item-likes">
                  <span className="visually-hidden">Likes:</span>
                  <Icon name="heart" /> {post.likes}
                </li>
                <li className="gallery-item-comments">
                  <span className="visually-hidden">Comments:</span>
                  <Icon name="comment" /> {post.comments}
                </li>
              </ul>
            </div>
          </div>
        </Link>
      );
    });
    if (alert.type) {
      return (
        <div className="container">
          <Messages alert={alert} />
        </div>
      );
    }
    return (
      <div className="container">
        <div className="hashtag">#{match.params.hashtag}</div>
        <div>
          <p style={{ fontSize: "2rem", paddingBottom: "1%" }}>
            {" "}
            {totalPostsByHashtag} posts
          </p>
          <Divider></Divider>
          <InfiniteScroll
            className="gallery"
            dataLength={hashtagPosts.length} //This is important field to render the next data
            next={this.fetchData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
          >
            {hashtagPosts}
          </InfiniteScroll>
        </div>
        <Divider hidden></Divider>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  data: state.post,
  alert: state.alert
});

const connectedHashtagPage = connect(mapStateToProps)(HashtagPage);
export { connectedHashtagPage as default };
