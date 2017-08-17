module.exports = {

    'facebookAuth' : {
        'clientID'      : '473481666356803', // your App ID
        'clientSecret'  : 'a1a0f81dd2225147d93373989ab7df94', // your App Secret
        'callbackURL'   : 'http://local.handsomebones.net:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
