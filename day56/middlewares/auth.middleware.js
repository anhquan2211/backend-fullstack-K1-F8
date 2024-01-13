const { User, Device } = require("../models");

module.exports = async (req, res, next) => {
  const { userLogin } = req.session;

  // If there is no userLogin session, or the user is not logged in, redirect to login
  if (!userLogin) {
    res.clearCookie("__Secure_token");
    return res.redirect("/auth/login");
  }
  next();

  //   const userId = userLogin.id;
  //   const tokenCookie = req.cookies.userToken;

  //   // Check if there is an active session for the user on any device
  //   const device = await Device.findOne({
  //     where: { user_id: userId, status: true },
  //   });

  //   // If there is no active session, clear the cookie and redirect to login
  //   if (!device) {
  //     res.clearCookie("__Secure_token");
  //     return res.redirect("/auth/login");
  //   }

  //   const tokenDeviceDatabase = device.token;

  //   // If the tokens don't match, clear the cookie and redirect to login
  //   if (tokenCookie !== tokenDeviceDatabase) {
  //     res.clearCookie("__Secure_token");
  //     return res.redirect("/auth/login");
  //   }

  //   // If everything is fine, proceed to the next middleware or route
  //   next();
  // } catch (error) {
  //   console.log(error);
  //   // Handle errors appropriately, maybe redirect to an error page
  //   res.redirect("/error");
  // }
};
