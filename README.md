**Favorite Blogs** web application backend. The frontend is (https://github.com/MarianiGiacomo/favoriteblogs-fe)[here].

Build the frontend and copy the `dist/` folder here. Express will serve the frontend static files.

## API endpoints
`/api/users`

`/api/blogs`

`/api/login`

## Env Varaiables
Create a `.env` file in the root folder with:


```
TEST_MONGODB_URI=<uri for mongodb test>
MONGODB_URI=<uri for mongodb production>
NODE_ENV=<test OR production>
SECRET=<secret for jsw token>
```
Alternatively, if you use for example Heroku, set the env variables from your project settings
