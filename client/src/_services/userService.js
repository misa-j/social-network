export const userService = {
  login,
  logout,
  sendVerificationEmail,
  sendforgotPasswordEmail,
  register,
  getUserData,
  resetPassword,
  updateUser,
  followUser,
  getUserProfileData,
  getPosts,
  getUserProfileFollowers,
  getUserProfileFollowings,
  getNewUsers,
};

function login(email, password) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  };

  return fetch("/api/user/login", requestOptions)
    .then(handleResponse)
    .then((res) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem("user", JSON.stringify({ token: res.user.token }));
      return res.user;
    });
}

function getNewUsers(params) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params }),
  };

  return fetch("/api/user/getNewUsers", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function resetPassword(data) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    headers: {
      Authorization: "Bearer " + data.jwt,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  };

  return fetch("/api/user/passwordreset", requestOptions)
    .then(handlePasswordResetResponse)
    .then((res) => {
      return res;
    });
}

function sendVerificationEmail(email) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  };
  return fetch("/api/user/sendVerificationEmail/", requestOptions).then(
    handleResponse
  );
}

function sendforgotPasswordEmail(email) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  };
  return fetch("/api/user/sendforgotPasswordEmail/", requestOptions).then(
    handleResponse
  );
}

function logout() {
  localStorage.removeItem("user");
}

function register(user) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };
  return fetch("/api/user/signup/", requestOptions).then(handleResponse);
}

function getUserData(queryParams) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...queryParams }),
  };
  return fetch("/api/user/getUserData", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function getPosts(queryParams) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...queryParams }),
  };
  return fetch("/api/user/getPosts", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function updateUser(user) {
  delete user.isDisabled;
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };

  return fetch("/api/user/updateUser", requestOptions)
    .then(handleResponse)
    .then((user) => {
      localStorage.setItem("user", JSON.stringify({ token: user.token }));
      //localStorage.setItem("user", JSON.stringify(user));

      return user;
    });
}

function followUser(userId) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  };

  return fetch("/api/user/followUser", requestOptions)
    .then(handleResponse)
    .then((user) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      //localStorage.setItem("user", JSON.stringify(user));

      return user;
    });
}

function getUserProfileData(username) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username.trim() }),
  };

  return fetch("/api/user/getProfilePageData", requestOptions)
    .then(handleResponse)
    .then((user) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      //localStorage.setItem("user", JSON.stringify(user));
      return user;
    });
}

function getUserProfileFollowers(userId) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  };
  return fetch("/api/user/getUserProfileFollowers", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function getUserProfileFollowings(userId) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  };
  return fetch("/api/user/getUserProfileFollowings", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        window.location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function handlePasswordResetResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
