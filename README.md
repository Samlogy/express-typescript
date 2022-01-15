# express-typescript

build boilerplate in express with typescript which involves (user managment system - security best practices in express - a handful structure for a backend api)

## User Managment system
1. Register User + email confirmation account
2. Login User
3. Logout User
4. get user data + session info
5. Forgot Password + email code verification
6. Reset Password + email confirmation

## Security
1. helmet (protect app from well known vulnerabilities sent in http headers)
2. set rater limiter ALL Requests (limit number of request to api endpoint)
3. mongoSanitize (protect from NoSQL injections)
4. set body length (size) to 10Kb 
