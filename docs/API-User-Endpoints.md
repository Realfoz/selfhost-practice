

### GET /api/users
Used to add a new user account. This will only result in the user being added to the database and they will still need to login to generate access tokens.

Request Body:
```json
{
  "password": "<password>",
  "email": "user@example.com"
}
```

Uses:

	- Confirms its a valid email address and removes any additional white spaces.
	- Hashes and salts the password before being written to the database.

Response:
```json
{
  "id": "<users_UUID",
  "createdAt": "2021-07-07T00:00:00Z",
  "updatedAt": "2021-07-07T00:00:00Z",
  "email": "user@example.com",
  "isChirpyRed": "true" 
}
```



### PUT /api/users
The user must be logged in with valid access token token to use this endpoint.
Allows the user to change the stored password or email for the user account.
The request body can be either: Password | Email | Both in the body

Request Body:
```json
{
  "password": "<password>",
  "email": "user@example.com"
}
```

Uses:

	- Confirms its a valid user using the access token
	- Hashes and salts the new password if sent
	- Updates the database with the new details
	- No new tokens are generated from this action

Response:
```json
{
  "id": "50746277-23c6-4d85-a890-564c0044c2fb",
  "createdAt": "2021-07-07T00:00:00Z",
  "updatedAt": "2021-07-07T00:00:00Z",
  "email": "user@example.com",
  "isChirpyRed": "true" 
}
```



### POST /api/login
Authenticates a user and starts a session.
Request Body:
```json
{
  "password": "<password>",
  "email": "user@example.com"
}
```

Uses:

	- Verifies users credentials and issues new tokens.
	- The access token (JWT) expires in 1 hour
	- The refresh token lasts 60 days and is needed for server side future access tokens and admin control on user accounts

Response:
```json
{
  "id": "<users_UUID",
  "createdAt": "2021-07-01T00:00:00Z",
  "updatedAt": "2021-07-01T00:00:00Z",
  "email": "user@example.com",
  "token": "<new_jwt_acceess_token>",
  "refreshToken": "<new_refresh _token>"
}
```



### POST /api/refresh
 Send the current valid refresh token as the following format to refresh the users current access token.
 The user must be logged in with valid access token to use this endpoint.
 
 Request Body:
 ```json
{
  "token": "<current_refresh_token>"
}
```

Uses:

	- Verifies users credentials from current tokens
	- Creates and updates the refresh token with a 60 day expiry
	- Creates a new access token with a 1 hour expiry

Response:
```json
{
  "token": "<new_access_jwt>",
  "refreshToken": "<new_rotated_refresh_token>",
  "expiresIn": 3600
}
```

