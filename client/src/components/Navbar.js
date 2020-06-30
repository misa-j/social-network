import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Icon, Image, Dropdown, Label } from "semantic-ui-react";
import { connect } from "react-redux";
import { history } from "../_helpers/history";
import { notificationActions } from "../actions/notificationActions";
import { socketActions } from "../actions/socketActions";
import { userActions } from "../actions/userActions";
import { NotificationPopup } from "./NotificationPopup";
import { AutosuggestExample } from "../components/Autosuggestion";
import { AnsweringModal } from "../MessengerPage/AnsweringModal";

function trigger(image, name) {
  return (
    <span>
      <Image
        size="mini"
        avatar
        src={"/images/profile-picture/100x100/" + image}
      />{" "}
      {name}
    </span>
  );
}

function getUserDataF(path, cb) {
  const params = {
    profilePage: false,
    userProfile: false,
  };
  if (path === "/") {
    cb({ ...params });
  } else if (path === "/profile") {
    cb({ ...params, profilePage: true });
  } else {
    cb({ ...params, userProfile: true });
  }
}

class Navbar extends Component {
  constructor() {
    super();

    this.state = {
      value: "",
      options: [
        {
          key: "user",
          text: "Account",
          icon: "user",
          value: "profile",
          active: false,
        },
        {
          key: "sign-out",
          text: "Sign Out",
          icon: "sign out",
          value: "login",
          active: false,
        },
      ],
      activePath: "",
    };
    this.params = {
      homePage: false,
      profilePage: false,
      userProfile: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    history.listen((location) => {
      this.setState({ activePath: location.pathname });

      getUserDataF(location.pathname, (data) =>
        dispatch(userActions.getUserData(data))
      );
    });

    getUserDataF(history.location.pathname, (data) =>
      dispatch(userActions.getUserData(data))
    );
  }

  handleNotificationPopupToggle = (e) => {
    e.stopPropagation();
    const { dispatch, notifications } = this.props;
    const ids = notifications.filter((e) => !e.read).map((e) => e._id);

    dispatch(notificationActions.toggleNotificationPopup());

    if (!notifications.length) {
      dispatch(
        notificationActions.fetchNotifications({ initialFetch: true }, ids)
      );
    } else {
      const lastId = notifications[notifications.length - 1]._id;
      dispatch(
        notificationActions.fetchNotifications(
          { initialFetch: false, lastId },
          ids
        )
      );
    }
  };

  handleChange = (e, { value }) => {
    if (value === "login") {
      localStorage.removeItem("user");
      window.location.reload(true);
    }
    history.push("/" + value);
    this.setState({ value });
  };

  render() {
    const { user, answeringModal } = this.props;
    const { value, options, activePath } = this.state;

    if (user.loadingUser) {
      return null;
    } else {
      return (
        <div className="main-navbar">
          <div className="nav-item logo">
            <Link to={"/"}>SOCIAL-NETWORK</Link>
          </div>
          <div className="nav-item search-bar">
            <AutosuggestExample />
          </div>
          <div className="nav-item nav-menu">
            <Menu borderless className="top-menu">
              <Menu.Menu className="nav-container">
                {/* 5 */}
                <Menu.Menu position="right">
                  <Menu.Item active={activePath === "/"} as={Link} to="/">
                    <Icon name="home" size="big" />
                  </Menu.Item>
                  <Menu.Item
                    active={activePath.includes("/messages/")}
                    as={Link}
                    to="/messages/chat"
                  >
                    <Icon name="facebook messenger" size="big" />
                    {user.data.messagesCount !== 0 ? (
                      <Label color="red" style={{ margin: 0 }}>
                        {user.data.messagesCount}
                      </Label>
                    ) : (
                      <Label color="grey" style={{ margin: 0 }}>
                        0
                      </Label>
                    )}
                  </Menu.Item>

                  <NotificationPopup>
                    <Menu.Item
                      onClick={(e) => this.handleNotificationPopupToggle(e)}
                    >
                      <Icon name="bell" size="big" />
                      {user.data.notificationsCount !== 0 ? (
                        <Label color="red" style={{ margin: 0 }}>
                          {user.data.notificationsCount}
                        </Label>
                      ) : (
                        <Label color="grey" style={{ margin: 0 }}>
                          0
                        </Label>
                      )}
                    </Menu.Item>
                  </NotificationPopup>

                  {/* 7*/}
                  <Menu.Item
                    active={activePath === "/profile"}
                    name="avatar"
                    id="avatar-container"
                  >
                    <Dropdown
                      trigger={trigger(user.data.profilePicture)}
                      selectOnNavigation={false}
                      options={options}
                      icon={null}
                      onClose={() => this.setState({ value: "" })}
                      onChange={this.handleChange}
                      value={value}
                    />
                  </Menu.Item>
                  <Menu.Item
                    id="icon-container"
                    active={activePath === "/profile"}
                  >
                    <Dropdown
                      trigger={<Icon name="user" size="big" />}
                      selectOnNavigation={false}
                      options={options}
                      icon={null}
                      onClose={() => this.setState({ value: "" })}
                      onChange={this.handleChange}
                      value={value}
                    />
                  </Menu.Item>
                </Menu.Menu>
              </Menu.Menu>
            </Menu>
          </div>
          {answeringModal.isOpen ? <AnsweringModal></AnsweringModal> : null}
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  notifications: state.notification.notifications,
  answeringModal: state.chat.answeringModal,
  currentRoom: state.chat.currentRoom,
  roomId: state.chat.roomId,
});

const connectNavbar = connect(mapStateToProps)(Navbar);
export { connectNavbar as default };
