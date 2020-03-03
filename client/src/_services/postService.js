export const postService = {
  fetchPosts,
  getPostsByHashtag,
  getPostsByLocation,
  addPost,
  addProfiePicture,
  deletePost,
  likePost,
  getPostLikes,
  getPost,
  logout
};

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
}

function fetchPosts(queryParams) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({ ...queryParams })
  };

  return fetch("/api/post/getPosts/", requestOptions)
    .then(handleResponse)
    .then(response => {
      return response.data;
    });
}

function getPostLikes(postId) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({ postId })
  };

  return fetch("/api/post/getPostLikes/", requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    });
}

function getPostsByHashtag(hashtag, queryParams) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({ hashtag, ...queryParams })
  };

  return fetch("/api/post/getPostsByHashtag/", requestOptions)
    .then(handleResponse)
    .then(response => {
      return response.data;
    });
}

function getPostsByLocation(coordinates, queryParams) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({ coordinates, ...queryParams })
  };

  return fetch("/api/post/getPostsByLocation/", requestOptions)
    .then(handleResponse)
    .then(response => {
      return response.data;
    });
}

function deletePost(postId) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({ postId })
  };

  return fetch("/api/post/delete/", requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function addPost(postData) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: postData
  };

  return fetch("/api/post/addPost/", requestOptions)
    .then(handleResponse)
    .then(res => {
      return res.post;
    });
}

function addProfiePicture(postData) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: postData
  };

  return fetch("/api/user/addProfiePicture/", requestOptions)
    .then(handleResponse)
    .then(user => {
      return user;
    });
}

function likePost(postId, authorId) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({ postId, authorId })
  };

  return fetch("/api/post/likePost/", requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function getPost(postId) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({ postId })
  };

  return fetch("/api/post/getPost/", requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        console.log(response);
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
