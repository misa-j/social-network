import React, { Component } from "react";
import { Button, Message, Modal, Form } from "semantic-ui-react";
import { connect } from "react-redux";
import { userActions } from "../actions/userActions";
import ProfilePictureForm from "./ProfilePictureForm";

class ImageCropModal extends Component {
  state = { open: false };

  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  render() {
    const { open } = this.state;

    return (
      <Modal
        open={open}
        onOpen={this.open}
        onClose={this.close}
        size="small"
        trigger={
          <Button size="big" content="Update profile picture" primary fluid />
        }
      >
        <Modal.Header>Select profile picture</Modal.Header>
        <Modal.Content>
          <ProfilePictureForm />
        </Modal.Content>
      </Modal>
    );
  }
}

class EditProfileModal extends Component {
  state = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    bio: "",
    isDisabled: true
  };

  componentDidMount = () => {
    const { firstName, lastName, username, email, bio } = this.props;
    this.setState({
      firstName,
      lastName,
      username,
      email,
      bio,
      isDisabled: true
    });
  };

  handleChange = (e, { name, value }) => {
    this.setState({ isDisabled: false, [name]: value });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    dispatch(userActions.updateUserData(this.state));
    this.setState({ isDisabled: true });
  };

  render() {
    const { firstName, lastName, username, email, bio } = this.state;

    const { updaingUser, hasError } = this.props;
    return (
      <Modal trigger={this.props.children} style={{ color: "reda" }}>
        <Modal.Header>Edit profile</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {hasError ? (
              <Message negative>
                <p>{hasError}</p>
              </Message>
            ) : null}
            <Form
              size="huge"
              name="form"
              onSubmit={this.handleSubmit}
              loading={updaingUser ? true : false}
            >
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="First Name"
                  placeholder="First Name"
                  type="text"
                  name="firstName"
                  onChange={this.handleChange}
                  value={firstName}
                />

                <Form.Input
                  fluid
                  label="Last Name"
                  placeholder="Last Name"
                  type="text"
                  name="lastName"
                  onChange={this.handleChange}
                  value={lastName}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Username"
                  placeholder="Username"
                  type="text"
                  name="username"
                  onChange={this.handleChange}
                  value={username}
                />
                <Form.Input
                  fluid
                  label="Email"
                  placeholder="Email"
                  type="text"
                  name="email"
                  onChange={this.handleChange}
                  value={email}
                />
              </Form.Group>
              <Form.TextArea
                style={{ minHeight: 100, maxHeight: 100 }}
                label="About"
                placeholder="Tell us more about you..."
                type="text"
                name="bio"
                onChange={this.handleChange}
                value={bio}
              />
              <Button
                style={{ marginBottom: "1%" }}
                size="big"
                content="Update information"
                disabled={this.state.isDisabled}
                primary
                fluid
              />
              <ImageCropModal />
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const { updaingUser, hasError } = state.user;
  const { firstName, lastName, username, email, bio } = state.user.data;
  return {
    updaingUser,
    hasError,
    firstName,
    lastName,
    username,
    email,
    bio
  };
}

const connectedEditProfileModal = connect(mapStateToProps)(EditProfileModal);
export { connectedEditProfileModal as EditProfileModal };
