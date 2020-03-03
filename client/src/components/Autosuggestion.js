import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import { Link } from "react-router-dom";
import { history } from "../_helpers/history";
import { throttle } from "throttle-debounce";
import { connect } from "react-redux";

function searchUser(q) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ q })
  };

  return fetch("/api/user/searchByUsername", requestOptions).then(res => {
    return res;
  });
}

function getSuggestionValue({ username }) {
  return username;
}

function renderSuggestion({ firstName, lastName, username, profilePicture }) {
  return (
    <Link to={"/" + username}>
      <span className={"suggestion-content " + username}>
        <img alt="" src={"/images/profile-picture/100x100/" + profilePicture} />
        <span className="autosuggestion-name">
          {username}
          <p>{`${firstName} ${lastName}`}</p>
        </span>
      </span>
    </Link>
  );
}

function renderSuggestionForTags({
  firstName,
  lastName,
  username,
  profilePicture
}) {
  return (
    <span className={"suggestion-content " + username}>
      <img alt="" src={"/images/profile-picture/100x100/" + profilePicture} />
      <span className="autosuggestion-name">
        {username}
        <p>{`${firstName} ${lastName}`}</p>
      </span>
    </span>
  );
}

class AutosuggestExample extends Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: [],
      isLoading: false
    };

    this.debouncedLoadSuggestions = throttle(500, this.loadSuggestions);
  }

  loadSuggestions(value) {
    const autosuggestInput = document.querySelector(".react-autosuggest__input")
      .classList;
    autosuggestInput.add("user-suggestion-loading");
    this.setState({
      isLoading: true
    });

    searchUser(value).then(response => {
      if (value === this.state.value) {
        response.json().then(results => {
          autosuggestInput.remove("user-suggestion-loading");
          this.setState({
            isLoading: false,
            suggestions: results.users.map(user => {
              return {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                profilePicture: user.profilePicture
              };
            })
          });
        });
      } else {
        autosuggestInput.remove("user-suggestion-loading");
        // Ignore suggestions if input value changed
        this.setState({
          isLoading: false
        });
      }
    });
  }

  onKeyDown = event => {
    const { addTagPage } = this.props;
    const { value } = this.state;

    if (event.keyCode === 13 && !addTagPage && value !== "") {
      history.push(`/${value}`);
    } else if (event.keyCode === 13 && addTagPage) {
      this.props.addAutocompleteTag(value);
    }
  };

  onChange = (event, { newValue }) => {
    const { addTagPage } = this.props;
    if (addTagPage) {
      this.props.handleChange(newValue);
    }
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.debouncedLoadSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const { addTagPage, submitOnClick } = this.props;
    const inputProps = {
      placeholder: "Search",
      value: submitOnClick ? "" : value, // when adding image tags
      onChange: this.onChange,
      onKeyDown: this.onKeyDown
    };

    return (
      <Autosuggest
        onKeyDown={this.handleOnKeyDown}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={
          addTagPage ? renderSuggestionForTags : renderSuggestion
        }
        inputProps={inputProps}
      />
    );
  }
}

const connectedAutosuggestExample = connect(null)(AutosuggestExample);
export { connectedAutosuggestExample as AutosuggestExample };
