import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { List, Image, Dimmer, Loader, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { userActions } from "../actions/userActions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

class NewUsersList extends Component {
  componentDidMount = () => {
    const { dispatch, newUsers } = this.props;
    if (!newUsers.users.length) {
      dispatch(userActions.getNewUsers({ initialFetch: true }));
    }
  };

  fetchMoreUsers = () => {
    const {
      dispatch,
      newUsers: { users, fetchingNewUsers }
    } = this.props;

    if (!fetchingNewUsers) {
      const lastId = users[users.length - 1]._id;
      dispatch(userActions.getNewUsers({ initialFetch: false, lastId }));
    }
  };

  render() {
    const { newUsers, username } = this.props;

    const users = newUsers.users.map(user => {
      return (
        <List.Item key={user._id}>
          <Image
            avatar
            src={`/images/profile-picture/100x100/${user.profilePicture}`}
          />
          <List.Content>
            <List.Header
              as={Link}
              to={user.username === username ? "/profile" : "/" + user.username}
            >
              {user.username}
            </List.Header>

            <span style={{ color: "#757575" }}>
              joined {dayjs(user.date).fromNow()}
            </span>
          </List.Content>
        </List.Item>
      );
    });
    return (
      <Fragment>
        <List size="big">
          {newUsers.fetching ? (
            <Dimmer active>
              <Loader />
            </Dimmer>
          ) : null}
          {users}
          {newUsers.usersCount - newUsers.users.length !== 0 ? (
            <Button
              fluid
              loading={newUsers.fetchingNewUsers}
              onClick={() => this.fetchMoreUsers()}
            >
              More users
            </Button>
          ) : null}
        </List>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  newUsers: state.newUsers,
  username: state.user.data.username
});

const connectedNewUsersList = connect(mapStateToProps)(NewUsersList);
export { connectedNewUsersList as NewUsersList };
