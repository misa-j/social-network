export const commentService = {
  addComment,
  getPostComments,
  logout,
  addCommentReply,
  getCommentReplies,
  getCommentLikes,
  getCommentReplyLikes,
  likeComment,
  likeCommentReply
};

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
}

function addComment(params) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({
      ...params
    })
  };

  return fetch("/api/comment/addComment/", requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function addCommentReply(params) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({
      ...params
    })
  };

  return fetch("/api/comment/addCommentReply/", requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function getCommentReplies(commentId, queryParams) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({ commentId, ...queryParams })
  };

  return fetch("/api/comment/getCommentReplies/", requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function getPostComments(postId, queryParams) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({ postId, ...queryParams })
  };

  return fetch("/api/comment/getComments/", requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function getCommentLikes(commentId) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({ commentId })
  };

  return fetch("/api/comment/getCommentLikes/", requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    });
}

function getCommentReplyLikes(commentId) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({ commentId })
  };

  return fetch("/api/comment/getCommentReplyLikes/", requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    });
}

function likeComment(params) {
  delete params.commentLikes;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({ ...params })
  };

  return fetch("/api/comment/likeComment/", requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function likeCommentReply(params) {
  delete params.commentReplyLikes;
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token
    },
    body: JSON.stringify({
      ...params
    })
  };

  return fetch("/api/comment/likeCommentReply/", requestOptions)
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
