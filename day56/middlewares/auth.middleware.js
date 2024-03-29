const { User, Device } = require("../models");

module.exports = async (req, res, next) => {
  const { userLogin } = req.session;

  console.log("userLogin in authMiddleware: ", userLogin);

  const tokenCookie = req.cookies.__Secure_token;
  console.log(tokenCookie);

  // If there is no userLogin session, or the user is not logged in, redirect to login
  if (!userLogin || !tokenCookie) {
    res.clearCookie("__Secure_token");
    return res.redirect("/auth/login");
  }

  const user = await User.findByPk(userLogin.id);

  if (!user) {
    req.session.destroy();
    res.clearCookie("__Secure_token");
    return res.redirect("/auth/login");
  }

  // const tokenCookie = req.cookies.__Secure_token;

  // if (!!tokenCookie) {
  //   console.log("token undefined");
  //   return res.redirect("/auth/login");
  // }

  const device = await Device.findOne({
    where: {
      user_id: userLogin.id,
      token: tokenCookie,
    },
  });

  console.log(device);

  if (!device.status) {
    res.clearCookie("__Secure_token");
    return res.redirect("/auth/login");
  }

  // // If the device is not found or has status false, clear the cookie and redirect to login
  // if (!device || !device.status) {
  //   res.clearCookie("__Secure_token");
  //   return res.redirect("/auth/login");
  // }

  // console.log(devices);

  // // Check if any device has a status of false
  // const hasInactiveDevice = devices.some((device) => !device.status);

  // if (hasInactiveDevice) {
  //   res.clearCookie("__Secure_token");
  //   return res.redirect("/auth/login");
  // }

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
