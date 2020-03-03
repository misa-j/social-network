const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.getPosts = (req, res, next) => {
  const schema = Joi.object({
    initialFetch: Joi.boolean().required(),
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

exports.getPostLikes = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.getPostsByHashtag = (req, res, next) => {
  const schema = Joi.object({
    initialFetch: Joi.boolean().required(),
    hashtag: Joi.string()
      .min(1)
      .required(),
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

exports.getPostsByLocation = (req, res, next) => {
  const schema = Joi.object({
    initialFetch: Joi.boolean().required(),
    coordinates: Joi.string()
      .min(3)
      .required(),
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

exports.getPost = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.likePost = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required(),
    authorId: Joi.objectId().required()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.deletePost = (req, res, next) => {
  const schema = Joi.object({
    postId: Joi.objectId().required()
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.createPost = (req, res, next) => {
  const validateObject = Object.assign({}, req.body);
  validateObject.tags = JSON.parse(validateObject.tags);

  const schema = Joi.object({
    description: Joi.string()
      .allow("")
      .required(),
    tags: Joi.array().required(),
    coordinates: Joi.string()
      .allow("")
      .required(),
    locationName: Joi.string()
      .allow("")
      .required(),
    photo: Joi.string().required()
  });

  const { error, value } = schema.validate(validateObject);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};
