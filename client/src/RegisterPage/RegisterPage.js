import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Form, Message, Icon } from "semantic-ui-react";
import { userActions } from "../actions/userActions";
import Messages from "../components/Messages";

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        retypepassword: ""
      },
      submitted: false,
      retTypePasswordError: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    document.title = "Register | social-network";
  };

  handleChange = event => {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
  };

  handleRetypePassword = event => {
    const { name, value } = event.target;
    const { user } = this.state;
    if (value !== this.state.user.password) {
      this.setState({
        user: {
          ...user,
          [name]: value
        },
        retTypePasswordError: true
      });
    } else {
      this.setState({
        user: {
          ...user,
          [name]: value
        },
        retTypePasswordError: false
      });
    }
  };

  handleSubmit(event) {
    event.preventDefault();

    this.setState({ submitted: true });
    const { user } = this.state;
    const { dispatch } = this.props;
    if (
      user.firstName &&
      user.lastName &&
      user.username &&
      user.password &&
      user.retypepassword &&
      !this.state.retTypePasswordError
    ) {
      dispatch(userActions.register(user));
    }
  }

  render() {
    const { registering, alert } = this.props;
    const { user, submitted, retTypePasswordError } = this.state;
    return (
      <div className="form-centered">
        <Message
          size="large"
          attached
          header="social-network"
          content="Fill out the form below to sign-up for a new account. (Do not use real credentials)"
        />
        <Form
          className="attached fluid segment"
          size="large"
          success={alert.type === "success" ? true : false}
          error={alert.type === "error" ? true : false}
          name="form"
          onSubmit={this.handleSubmit}
        >
          <Form.Group widths="equal">
            <Form.Input
              required
              label="First Name"
              placeholder="First Name"
              type="text"
              name="firstName"
              value={user.firstName}
              error={submitted && !user.firstName ? true : false}
              onChange={this.handleChange}
            />

            <Form.Input
              required
              label="Last Name"
              placeholder="Last Name"
              type="text"
              name="lastName"
              value={user.lastName}
              error={submitted && !user.lastName ? true : false}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              required
              autoCapitalize="none"
              label="Username"
              placeholder="Username"
              type="text"
              name="username"
              value={user.username}
              error={submitted && !user.username ? true : false}
              onChange={this.handleChange}
            />
            <Form.Input
              required
              label="Email"
              placeholder="Email"
              type="email"
              name="email"
              value={user.email}
              error={submitted && !user.email ? true : false}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Input
            required
            label="Password"
            placeholder="Password"
            type="password"
            name="password"
            value={user.password}
            error={submitted && !user.password ? true : false}
            onChange={this.handleChange}
          />
          <Form.Input
            required
            label="Re-type password"
            placeholder="Re-type password"
            type="password"
            name="retypepassword"
            value={user.retypepassword}
            error={
              (submitted && !user.retypepassword ? true : false) ||
              retTypePasswordError
            }
            onChange={this.handleRetypePassword}
          />
          <Button
            size="large"
            content="Sign up"
            icon="signup"
            fluid
            primary
            disabled={
              !retTypePasswordError &&
              user.retypepassword !== "" &&
              user.password !== "" &&
              user.email !== "" &&
              user.firstName !== "" &&
              user.lastName !== "" &&
              user.username !== ""
                ? false
                : true
            }
            loading={registering ? true : false}
          />

          {alert.type ? <Messages alert={alert} /> : null}
        </Form>
        <Message size="large" attached="bottom" warning>
          <Icon name="help" />
          Already signed up?&nbsp;<Link to={"/login"}>Login here</Link>
          &nbsp;instead.
        </Message>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  registering: state.registration.registering,
  alert: state.alert
});

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage);
export { connectedRegisterPage as default };
