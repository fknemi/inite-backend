// me?fields=id,name,email,birthday,about,education,gender,quotes,location,picture{url,cache_key,height,is_silhouette,width},languages,middle_name,short_name,supports_donate_button_in_live_video,groups{privacy,cover,member_count,member_request_count,name,administrator}
// Get User Data

// https://api.instagram.com/oauth/access_token \
//   -F client_id=990602627938098 \
//   -F client_secret=eb8c7... \
//   -F grant_type=authorization_code \
//   -F redirect_uri=https://socialsizzle.herokuapp.com/auth/ \
//   -F code=AQCvI...

import axios from "axios";
import { Router, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as queryString from "querystring";
import { instagramUser } from "../../models/ig/instagramUser";

const router = Router();
router.post("/link/instagram", async (req: Request, res: Response, context) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(404).send("Invalid User");
  }

  let accessToken;
  let userId;

  // let accessToken = data: {
  //   access_token: 'IGQVJWc2JINlU3T2YzbDNycTJ1dlk1eFhHRm8xVjZARRVhFbmExaks3M0FYUktmVFF5Um40UEJFRVN4d1l6ZAjJCdVBxLXdXdHNmSDREZA2tDeDdxWlJfeXZApaXVvNmhTRWh6b0ExdnM4NDhaa1JQckNBY3p6TzhTUEtPQ0hF',
  //   user_id: 17841450477846204
  // }

  try {
    const authResponse = await axios.post(
      `https://api.instagram.com/oauth/access_token`,
      queryString.stringify({
        access_token: req.body.code,
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        grant_type: "authorization_code",
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code: req.body.code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    accessToken = authResponse.data.access_token;
    userId = authResponse.data.user_id;
  } catch (err) {
    console.log(err);

    return res.status(400).send("Authentication Failed");
  }
  if (!accessToken || !userId) {
    return res.status(400).send("Authentication Failed");
  }

  let instagramUsername;
  let instagramProfilePicture;
  try {
    // https://graph.instagram.com/v14.0/me?fields=id,username,email,account_type,media,media_count&
    console.log(accessToken)
    const userData = await axios.get(
      `https://graph.instagram.com/v14.0/me?fields=id,username,email&access_token=${accessToken}`
    );
    
    console.log(userData.status);
    console.log(userData.data);
    
    instagramUsername = userData.data.username;
  } catch (err) {
    console.log(err);
    return res.status(400).send("Authentication Failed");
  }
  if (!instagramUsername) {
    return res.status(400).send("Authentication Failed");
  }
  const iguser = await instagramUser.findOne({ username: instagramUsername });
  if (!iguser) {
    return res.status(400).send("Authentication Failed");
  }
  const newInstagramUser = new instagramUser({
    username: instagramUsername,
    

  })

});

export { router };
