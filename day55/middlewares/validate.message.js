module.exports = (req, res, next) => {
  const getErrors = (errors) => {
    if (errors?.length) {
      errors = errors[0];
      return errors;
    }
  };

  const getOld = (old) => {
    console.log("old: ", old);
    if (old?.length) {
      const olds = old[0];
      return olds;
    }
  };

  const errors = req.flash("errors");
  const old = req.flash("old");
  req.errors = getErrors(errors);
  req.old = getOld(old);
  next();
};
