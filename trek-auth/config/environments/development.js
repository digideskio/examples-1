export default (config) => {

  config.set('middleware', {
    morgan: {
      mode: 'dev',
      stream: false
    },

    staticCache: {
      buffer: false,
      maxAge: 0,
      /*
      alas: {
        '/favicon.ico': '/favicon.png'
      }
      */
    },

    methodoverride: null,

    compress: { }

  });

  config.set('views', {
    cache: false
  });

  // mail
  config.set('mail', {
    transport: 'mailgun',
    options: {
      auth: {
        api_key: config.env.MAILGUN_API_KEY,
        domain: config.env.MAILGUN_DOMAIN
      }
    }
  });

  config.set('passport', {
    list: [ 'twitter', 'github', 'digitalocean', 'bitbucket' ],
    strategies: {
      local: {
        initialize: {
          // by default, local strategy uses username and password, we will override with email
          //usernameField: 'username',
          //passwordField: 'password',
          passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        authenticate: {
          successRedirect: '/',
          failureRedirect: '/login',
          failureFlash: true
        }
      },
      bearer: {},
      twitter: {
        protocol: 'oauth',
        initialize: {
          consumerKey: config.env.TWITTER_CONSUMER_KEY,
          consumerSecret: config.env.TWITTER_CONSUMER_SECRET,
          callbackURL: '/auth/twitter/callback'
        },
        authenticate: {
          successRedirect: '/',
          failureRedirect: '/login',
          failureFlash: true
        }
      },
      github: {
        protocol: 'oauth2',
        initialize: {
          //scope: ['user'],
          clientID: config.env.GITHUB_CLIENT_ID,
          clientSecret: config.env.GITHUB_CLIENT_SECRET,
          callbackURL: '/auth/github/callback'
        },
        authenticate: {
          successRedirect: '/',
          failureRedirect: '/login',
          failureFlash: true
        }
      },
      digitalocean: {
        protocol: 'oauth2',
        initialize: {
          clientID: config.env.DIGITALOCEAN_CLIENT_ID,
          clientSecret: config.env.DIGITALOCEAN_CLIENT_SECRET,
          userProfileURL: 'https://api.digitalocean.com/v2/account',
          callbackURL: '/auth/digitalocean/callback'
        },
        authenticate: {
          successRedirect: '/',
          failureRedirect: '/login',
          failureFlash: true
        },
        filter: (req, accessToken, refreshToken, profile, next) => {
          profile.id = profile._json.account.uuid;
          profile.email = profile._json.account.email;
          console.dir(profile)
          console.log('digitalocean filter')
          return [req, accessToken, refreshToken, profile, next];
        }
      },
      bitbucket: {
        protocol: 'oauth',
        initialize: {
          consumerKey: config.env.BITBUCKET_CONSUMER_KEY,
          consumerSecret: config.env.BITBUCKET_CONSUMER_SECRET,
          callbackURL: '/auth/bitbucket/callback'
        },
        authenticate: {
          successRedirect: '/',
          failureRedirect: '/login',
          failureFlash: true
        }
      }
    }
  });
};