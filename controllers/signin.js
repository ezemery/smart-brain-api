var jwt = require('jsonwebtoken');
var redis = require("redis");
var client = redis.createClient(process.env.REDIS_URI);


const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject(err + ' unable to get user'))
      } else {
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => Promise.reject(err + ' wrong credentials'))
}

const getAuthTokenId = (req, res) => {
  const {authorization} =  req.headers;
  return client.get(authorization, function(err, reply) {
    // reply is null when the key is missing
   if(err || !reply){
      return res.status(400).json({"something went wrong":err})
   }
   return res.json({userId:reply})
});
}

const signToken = (email) =>{
  const payload = {email}
  return jwt.sign(payload, 'JWT_SECRET', {"expiresIn": "2days"})
} 

const setToken = (token, id) => { return new Promise(function(resolve){
  resolve(client.set(token, id));
})};


const createSession = (user)=>{
  const {id, email } = user;
  const token = signToken(email);
  return setToken(token, id)
  .then(()=> { return {success:"true", userId:id, token:token}})
  .catch((error)=>res.status(400).json({"something went wrong":error}))
}

const userAuthentication = (db, bcrypt) => (req, res) =>{
  const { authorization } = req.headers;

  return authorization ? getAuthTokenId(req, res) : 
    handleSignin(db, bcrypt, req, res)
    .then(data => data.id && data.email ? createSession(data) : Promise.reject("something went wrong with fetching user data"))
    .then(success=> res.json(success))
    .catch(err => res.status(400).json({"something went wrong": err}))
}

module.exports = {
  userAuthentication: userAuthentication
}