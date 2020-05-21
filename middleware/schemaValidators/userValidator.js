const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.addUser = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(2)
      .max(30)
      .pattern(
        new RegExp(
          /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
        )
      )
      .required(),
    lastName: Joi.string()
      .min(2)
      .max(30)
      .pattern(
        new RegExp(
          /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
        )
      )
      .required(),
    username: Joi.string()
      .min(3)
      .max(30)
      .insensitive()
      .invalid("login", "register", "profile")
      .pattern(
        new RegExp(
          /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
        )
      )
      .required(),
    email: Joi.string()
      .min(5)
      .max(30)
      .pattern(
        new RegExp(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )
      )
      .required(),
    password: Joi.string().min(3).max(30).required(),
    retypepassword: Joi.required().valid(Joi.ref("password")),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.resetPassword = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string().min(3).max(30).required(),
    retypepassword: Joi.required().valid(Joi.ref("password")),
    jwt: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.getNewUsers = (req, res, next) => {
  const schema = Joi.object({
    initialFetch: Joi.boolean().required(),
    lastId: Joi.when("initialFetch", {
      is: false,
      then: Joi.objectId().required(),
      otherwise: Joi.forbidden(),
    }),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.sendVerificationEmail = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .pattern(
        new RegExp(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )
      )
      .required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.loginUser = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.changeActivityStatus = (req, res, next) => {
  const schema = Joi.object({
    activityStatus: Joi.string().valid("online", "offline").required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.getUserData = (req, res, next) => {
  const schema = Joi.object({
    initialFetch: Joi.boolean().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.getPosts = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
    lastId: Joi.objectId().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.getUserProfileData = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.getUserProfileFollowers = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.getUserProfileFollowings = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.updateUser = (req, res, next) => {
  const validateObj = {
    ...req.body,
    username: req.body.username.trim().toLowerCase(),
  };

  const schema = Joi.object({
    firstName: Joi.string()
      .pattern(
        new RegExp(
          /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
        )
      )
      .min(3)
      .max(30)
      .required(),
    lastName: Joi.string()
      .pattern(
        new RegExp(
          /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
        )
      )
      .min(3)
      .max(30)
      .required(),
    username: Joi.string()
      .invalid("login", "register", "profile")
      .pattern(
        new RegExp(
          /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/
        )
      )
      .min(3)
      .max(30)
      .required(),
    email: Joi.string()
      .pattern(
        new RegExp(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )
      )
      .required(),
    bio: Joi.string().max(250).allow(""),
  });

  const { error, value } = schema.validate(validateObj);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.searchByUsername = (req, res, next) => {
  const schema = Joi.object({
    q: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

exports.followUser = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};
