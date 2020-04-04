module.exports = (req, res, next) => {
  if (process.env.ENABLE_SEND_EMAIL === "false") {
    return res.status(200).json({ message: "Email verification disabled" });
  }
  next();
};
