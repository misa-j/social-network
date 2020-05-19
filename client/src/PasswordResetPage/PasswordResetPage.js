import React, { Component } from "react";
import { Button, Form } from "semantic-ui-react";
import { connect } from "react-redux";
import { userActions } from "../actions/userActions";
import Messages from "../components/Messages";

class PasswordResetPage extends Component {
  state = {
    password: "",
    retypepassword: "",
    jwt: "",
    submitDisabled: true,
  };

  componentDidMount = () => {
    document.title = "Password reset | social-network";
    this.setState({ jwt: this.props.match.params.jwt });
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState(
      {
        [name]: value,
      },
      () => {
        const { password, retypepassword } = this.state;
        if (password === retypepassword) {
          this.setState({
            submitDisabled: false,
          });
        } else {
          this.setState({
            submitDisabled: true,
          });
        }
      }
    );
  };

  handleSubmit = (event) => {
    const { dispatch } = this.props;
    const { password, retypepassword, jwt } = this.state;
    event.preventDefault();
    dispatch(userActions.resetPassword({ password, retypepassword, jwt }));
  };

  render() {
    const { alert, passwordReset } = this.props;
    const { password, retypepassword, submitDisabled } = this.state;
    const successAlert = alert.type === "success" ? true : false;
    const errorAlert = alert.type === "error" ? true : false;

    return (
      <div className="container">
        <Form
          success={successAlert}
          error={errorAlert}
          className="fluid segment"
          size="big"
          loading={passwordReset.requesting ? true : false}
          onSubmit={this.handleSubmit}
        >
          <Form.Field>
            <label>New password</label>
            <input
              onChange={this.handleChange}
              name="password"
              type="password"
              placeholder="New password"
              value={password}
            />
          </Form.Field>
          <Form.Field>
            <label>Re-type password</label>
            <input
              onChange={this.handleChange}
              name="retypepassword"
              type="password"
              placeholder="Re-type password"
              value={retypepassword}
            />
          </Form.Field>
          <Button disabled={submitDisabled} fluid type="submit">
            Submit
          </Button>
          <Messages alert={alert} />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  passwordReset: state.passwordReset,
  alert: state.alert,
});

const connectedPasswordResetPage = connect(mapStateToProps)(PasswordResetPage);
export { connectedPasswordResetPage as default };
