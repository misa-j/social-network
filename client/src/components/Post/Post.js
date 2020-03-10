import React, { Component } from "react";
import {
  Icon,
  Button,
  Dropdown,
  Modal,
  Segment,
  Image
} from "semantic-ui-react";
import { connect } from "react-redux";
import { postActions } from "../../actions/postActions";
import { commentActions } from "../../actions/commentActions";
import PostComments from "../Comments/PostComments";
import { Link } from "react-router-dom";
import LikePost from "./LikePost";
import PostForm from "./PostForm";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
import { history } from "../../_helpers/history";
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
  }
};

class Post extends Component {
  state = {
    open: false,
    loadedImg: false,
    value: "",
    showTags: false,
    optionsLoggedIn: [
      { key: "copy", icon: "copy", text: "Copy link", value: "copy" },
      {
        key: "goto",
        icon: "paper plane outline",
        text: "Go to post",
        value: "goto"
      },
      { key: "delete", icon: "delete", text: "Delete", value: "delete" }
    ],
    optionsNotLoggedIn: [
      { key: "copy", icon: "copy", text: "Copy link", value: "copy" },
      {
        key: "goto",
        icon: "paper plane outline",
        text: "Go to post",
        value: "goto"
      }
    ]
  };

  close = () => this.setState({ open: false, value: "" });

  handleToggleTags = () => {
    this.setState({ showTags: !this.state.showTags });
  };

  getPostComments = () => {
    const { dispatch, post, comments } = this.props;

    if (
      !comments[post._id].comments.length &&
      !comments[post._id].fetching &&
      post.comments
    ) {
      dispatch(
        commentActions.getPostComments(post._id, { initialFetch: true })
      );
    }
  };

  deletePost = () => {
    const { dispatch, post } = this.props;
    dispatch(postActions.deletePost(post._id));
  };

  handleChange = (e, { name, value }) => {
    this.setState({ value, open: false });
    if (value === "goto") {
      history.push("/p/" + this.props.post._id);
      this.setState({ value, open: false });
    }
    if (value === "delete") {
      this.setState({ value, open: true });
    }
    if (value === "copy") {
      navigator.clipboard.writeText(
        window.location.host + "/p/" + this.props.post._id
      );
    }
  };

  handleClose = () => {
    this.setState({ value: "", open: false });
  };

  render() {
    const { post, _id, username } = this.props;
    const {
      open,
      optionsLoggedIn,
      optionsNotLoggedIn,
      value,
      showTags
    } = this.state;

    const isFeedMarginBottom = post.feed ? "5rem" : "0";
    const renderDivs = post.tags.map(div => (
      <div
        key={div.id}
        className="text-box"
        style={{
          top: div.y + "%",
          left: div.x + "%",
          display: showTags ? "block" : "none"
        }}
      >
        <div className="tooltip tooltip-top">
          {div.value === username ? (
            <Link to={"/profile"}>{div.value}</Link>
          ) : (
            <Link to={"/" + div.value}>{div.value}</Link>
          )}
        </div>
      </div>
    ));
    const ribbon = post.tags.length ? (
      <div className="ribbon">
        <Icon
          circular
          size="large"
          name="users"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            display: showTags ? "none" : "block"
          }}
        />
      </div>
    ) : null;
    return (
      <div className="post" style={{ marginBottom: isFeedMarginBottom }}>
        <div className="post-header">
          <div className="post-label">
            <div className="label-image">
              <img
                src={`/images/profile-picture/100x100/${post.author[0].profilePicture}`}
                alt=""
              />
            </div>
            <div className="label-info">
              <div className="label-username">
                <Link
                  to={
                    post.author[0].username === username
                      ? "/profile"
                      : "/" + post.author[0].username
                  }
                >
                  {post.author[0].username}
                </Link>
              </div>
              <div className="label-time">
                {dayjs(post.createdAt).fromNow()}
              </div>
            </div>
            {post.location && post.location.address !== "" ? (
              <div className="label-location">
                <Link
                  to={`/location/${post.location.coordinates[0]},${post.location.coordinates[1]}`}
                >
                  {post.location.address}
                </Link>
              </div>
            ) : null}
          </div>
          <div className="post-options">
            <Modal open={open} onClose={this.close} size="tiny">
              <Modal.Header>Delete Your Post</Modal.Header>
              <Modal.Content>
                <p>Are you sure you want to delete your post</p>
              </Modal.Content>
              <Modal.Actions>
                <Button negative onClick={this.close}>
                  No
                </Button>
                <Button
                  positive
                  icon="checkmark"
                  labelPosition="right"
                  content="Yes"
                  onClick={this.deletePost}
                />
              </Modal.Actions>
            </Modal>
            {post.author[0]._id === _id ? (
              <Button.Group>
                <Dropdown
                  selectOnNavigation={false}
                  onChange={this.handleChange}
                  value={value}
                  className="button icon"
                  floating
                  options={optionsLoggedIn}
                  trigger={<React.Fragment />}
                />
              </Button.Group>
            ) : (
              <Button.Group>
                <Dropdown
                  selectOnNavigation={false}
                  onChange={this.handleChange}
                  value={value}
                  className="button icon"
                  floating
                  options={optionsNotLoggedIn}
                  trigger={<React.Fragment />}
                />
              </Button.Group>
            )}
          </div>
        </div>

        <div className="post-image">
          {this.state.loadedImg ? null : (
            <Segment loading>
              <Image src={`/images/post-images/thumbnail/${post.photo}`} />
            </Segment>
          )}
          <img
            onClick={this.handleToggleTags}
            onLoad={() => this.setState({ loadedImg: true })}
            style={this.state.loadedImg ? {} : { display: "none" }}
            src={`/images/post-images/${post.photo}`}
            alt=""
          />
          {ribbon}
          {renderDivs}
        </div>
        {post.description ? (
          <div className="post-description">
            <Linkify options={linkifyOptions}>{post.description}</Linkify>
          </div>
        ) : null}

        <div className="post-footer">
          <div className="footer-likes">
            <LikePost
              post={{
                postId: post._id,
                photo: post.photo,
                authorId: post.author[0]._id,
                likes: post.likes
              }}
            />
          </div>
          <div className="footer-comments">
            <Icon
              name="comment outline"
              style={{ cursor: "pointer" }}
              onClick={this.getPostComments}
            />
            <div>{post.comments}</div>
          </div>
        </div>

        <PostComments
          post={{
            postId: post._id,
            commentsCount: post.comments,
            photo: post.photo,
            authorId: post.author[0]._id
          }}
        />

        <div className="post-form">
          <PostForm
            post={{
              postId: post._id,
              authorId: post.author[0]._id,
              photo: post.photo
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { _id, username } = state.user.data;
  return {
    _id,
    username,
    comments: state.comments
  };
};

export default connect(mapStateToProps)(Post);
