import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Form, Message, Icon } from "semantic-ui-react";
import { userActions } from "../actions/userActions";
import Messages from "../components/Messages";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.props.dispatch(userActions.logout());

    this.state = {
      email: "",
      password: "",
      emailToVerify: "",
      forgotPasswordEmail: "",
      submitted: false,
      showForm: false,
      forgotPasswordForm: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount = () => {
    document.title = "Login | social-network";
  };

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    this.setState({ submitted: true });
    const { email, password } = this.state;
    const { dispatch } = this.props;
    if (email && password) {
      dispatch(userActions.login(email, password));
    }
    //this.setState({ email: "", password: "", submitted: false });
  }

  resendEmailVerification = () => {
    this.props.dispatch(
      userActions.sendVerificationEmail(this.state.emailToVerify)
    );
  };

  forgotPasswordEmail = () => {
    this.props.dispatch(
      userActions.sendforgotPasswordEmail(this.state.forgotPasswordEmail)
    );
  };

  toggleEmailVerification = () => {
    this.setState({ showForm: !this.state.showForm });
  };

  toggleForgotPasswordForm = () => {
    this.setState({
      forgotPasswordForm: !this.state.forgotPasswordForm,
    });
  };

  render() {
    const { loggingIn, alert } = this.props;
    const {
      email,
      password,
      submitted,
      showForm,
      forgotPasswordForm,
    } = this.state;
    return (
      <div className="form-centered">
        <Message
          size="large"
          attached
          header="social-network"
          content="Fill out the form below to log-in"
        />
        <Form
          className="attached fluid segment"
          size="large"
          name="form"
          success={alert.type === "success" ? true : false}
          error={alert.type === "error" ? true : false}
          onSubmit={this.handleSubmit}
        >
          <Form.Group widths="equal">
            <Form.Input
              autoCapitalize="none"
              label="Email"
              placeholder="Email or username"
              type="text"
              name="email"
              value={email}
              error={submitted && !email ? true : false}
              onChange={this.handleChange}
            />

            <Form.Input
              label="Password"
              placeholder="Password"
              type="password"
              name="password"
              value={password}
              error={submitted && !password ? true : false}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Button
            size="large"
            fluid
            content="Login"
            primary
            disabled={email !== "" && password !== "" ? false : true}
            loading={loggingIn ? true : false}
          />

          {alert.type ? <Messages alert={alert} /> : null}
        </Form>
        <Message size="large" attached="bottom" warning>
          <Icon name="help" />
          Don't have an account?&nbsp;
          <Link to={"/register"}>Create one now</Link>
          <br></br>
          <Icon name="help" />
          Forgot password?&nbsp;
          <span
            onClick={this.toggleForgotPasswordForm}
            style={{
              textDecoration: "underline",
              fontWeight: "900",
              cursor: "pointer",
            }}
          >
            reset password
          </span>
          <br></br>
          <Icon name="envelope" />
          Resend verification email.&nbsp;
          <span
            onClick={this.toggleEmailVerification}
            style={{
              textDecoration: "underline",
              fontWeight: "900",
              cursor: "pointer",
            }}
          >
            resend
          </span>
        </Message>
        {showForm ? (
          <Form className="segment" size="large" name="form">
            <Form.Field>
              <label>Email</label>
              <input
                name="emailToVerify"
                placeholder="Email"
                type="email"
                onChange={this.handleChange}
              />
            </Form.Field>

            <Button fluid type="submit" onClick={this.resendEmailVerification}>
              Resend
            </Button>
          </Form>
        ) : null}

        {forgotPasswordForm ? (
          <Form className="segment" size="large" name="form">
            <Form.Field>
              <label>Email</label>
              <input
                name="forgotPasswordEmail"
                placeholder="Email"
                type="email"
                onChange={this.handleChange}
              />
            </Form.Field>
            <Button fluid type="submit" onClick={this.forgotPasswordEmail}>
              Send
            </Button>
          </Form>
        ) : null}

        <Message>
          <Message.Header>
            <a
              href="https://github.com/misa-j/social-network"
              target="_blank"
              rel="noopener noreferrer"
            >
              Link to a github repo
            </a>
          </Message.Header>
        </Message>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loggingIn: state.authentication.loggingIn,
  alert: state.alert,
});

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as default };
