import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Icon, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Messages from "../components/Messages";
import { postActions } from "../actions/postActions";
import InfiniteScroll from "react-infinite-scroll-component";

class LocationPage extends Component {
  componentDidMount = () => {
    const {
      match,
      dispatch,
      data: { coordinates }
    } = this.props;

    if (coordinates !== match.params.coordinates) {
      dispatch(
        postActions.getPostsByLocation(match.params.coordinates, {
          initialFetch: true,
          coordinates: match.params.coordinates
        })
      );
    }
    document.title = "Location Page | social-network";
  };

  fetchData = () => {
    const {
      dispatch,
      data: { postsByLocation },
      match
    } = this.props;
    const lastId = postsByLocation[postsByLocation.length - 1]._id;
    dispatch(
      postActions.getPostsByLocation(match.params.coordinates, {
        initialFetch: false,
        lastId
      })
    );
  };

  render() {
    const {
      data: { postsByLocation, totalPostsByLocation },
      alert,
      match
    } = this.props;
    const hasMore =
      postsByLocation.length === totalPostsByLocation ? false : true;
    const [lat, lng] = match.params.coordinates.split(",");
    const locationPosts = postsByLocation.map(post => {
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
      <Fragment>
        <div className="map-header">
          <img
            alt=""
            src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l(${lat},${lng})/${lat},${lng},13,0.00,0.00/1200x250@2x?access_token=pk.eyJ1Ijoiam9obmJvcyIsImEiOiJjanl1b3l1MmkwaDdnM2pwaG5yNm1mZmlrIn0.O7X5QEcRO2ncLo_vLMVeTQ`}
          />
          <div className="location-name">
            {postsByLocation[0] ? postsByLocation[0].location.address : ""}
          </div>
        </div>
        <div className="container">
          <div>
            <p style={{ fontSize: "2rem", paddingBottom: "1%" }}>
              {" "}
              {totalPostsByLocation} posts
            </p>
            <Divider></Divider>
            <InfiniteScroll
              className="gallery"
              dataLength={locationPosts.length} //This is important field to render the next data
              next={this.fetchData}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
            >
              {locationPosts}
            </InfiniteScroll>
          </div>
        </div>
        <Divider hidden></Divider>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  data: state.post,
  fetchingUserData: state.user.loadingUser,
  alert: state.alert
});

const connectedLocationPage = connect(mapStateToProps)(LocationPage);
export { connectedLocationPage as default };
