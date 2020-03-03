const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.getComments = (req, res, next) => {
  const schema = Joi.object({
    initialFetch: Joi.boolean().required(),
    postId: Joi.objectId().required(),
    lastId: Joi.when("initialFetch", {
      is: false,
      then: Joi.objectId().required(),
      otherwise: Joi.forbidden()
    })
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.getCommentReplies = (req, res, next) => {
  const schema = Joi.object({
    initialFetch: Joi.boolean().required(),
    commentId: Joi.objectId().required(),
    lastId: Joi.when("initialFetch", {
      is: false,
      then: Joi.objectId().required(),
      otherwise: Joi.forbidden()
    })
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.addComment = (req, res, next) => {
  const schema = Joi.object({
    value: Joi.string().required(),
    postId: Joi.objectId().required(),
    authorId: Joi.objectId().required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.addCommentReply = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string().required(),
    commentId: Joi.objectId().required(),
    postId: Joi.objectId().required(),
    authorId: Joi.objectId().required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.getCommentLikes = (req, res, next) => {
  const schema = Joi.object({
    commentId: Joi.objectId().required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.getCommentReplyLikes = (req, res, next) => {
  const schema = Joi.object({
    commentId: Joi.objectId().required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.likeComment = (req, res, next) => {
  const schema = Joi.object({
    commentId: Joi.objectId().required(),
    authorId: Joi.objectId().required(),
    postId: Joi.objectId().required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.likeCommentReply = (req, res, next) => {
  const schema = Joi.object({
    commentId: Joi.objectId().required(),
    commentAt: Joi.objectId().required(),
    authorId: Joi.objectId().required(),
    postId: Joi.objectId().required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};
