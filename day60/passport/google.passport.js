const GoogleStrategy = require("passport-google-oidc");
const model = require("../models/index");
const Provider = model.Provider;
const User = model.User;

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ["profile", "email"],
  },
  async (issuer, profile, done) => {
    const { displayName, emails } = profile;
    const [{ value: email }] = emails;
    //kiểm tra trong table providers có Provider hay chưa?
    const provider = "google";
    let providerDetail = await Provider.findOne({
      where: {
        name: provider,
      },
    });

    //Insert nếu không có hoặc lấy id nếu đã có
    let providerId;
    if (!providerDetail) {
      providerDetail = await Provider.create({
        name: provider,
      });
    }

    providerId = providerDetail.id;

    //Kiểm tra trong bảng users xem đã có users với provider_id hay chưa?
    let user = await User.findOne({
      where: {
        email,
        provider_id: providerId,
      },
    });

    //Insert vào bảng users nếu chưa có provider_id hoặc lấy ra user nếu đã có
    if (!user) {
      user = await User.create({
        name: displayName,
        email,
        provider_id: providerId,
      });
    }

    return done(null, user);
  }
);
