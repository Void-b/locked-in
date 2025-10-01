import jwt from 'jsonwebtoken'

const secret = '2c2144055183dc0179d7c45c997a682b526b86f9ff880b55255bca28bb74e20d'

const userId = '3791c80c-51eb-4bc0-8748-129c24e14f03'

const token = jwt.sign(
  {
    userId,
    isAdmin: false,
  },
  secret,
  { expiresIn: '7d' }
)

console.log('Test JWT token:', token)
