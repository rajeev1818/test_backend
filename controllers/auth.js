const axios = require("axios");


const getAccessToken = async(req, res) => {
    const {code} = req.query;
    
    
    axios
  .post('https://github.com/login/oauth/access_token', {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: code,
  },
  {
    headers: {
        Accept: "application/json"
    }
    })
  .then((response) => {
    
    const { access_token } = response.data;
    
    return res.status(200).json({
        status: true,
        token: access_token
    })
  })
  .catch((error) => {
    console.error('Error obtaining access token:', error);
  });       
        
}
        
        
    






module.exports ={
    getAccessToken
}
