# social-network

Mini social network that I made as my first web app project.

## Demo

[social-network](http://46.101.189.55/login)

## Screenshots

![](screenshots/Screenshot%20from%202020-02-28%2023-25-47.png)
![](screenshots/Screenshot%20from%202020-02-29%2019-02-15.png)
![](screenshots/Screenshot%20from%202020-02-29%2019-04-54.png)
![](screenshots/Screenshot%20from%202020-02-29%2019-06-32.png)
![](screenshots/Screenshot%20from%202020-02-29%2019-07-23.png)
![](screenshots/Screenshot%20from%202020-02-29%2019-07-45.png)
![](screenshots/Screenshot%20from%202020-02-29%2019-07-06.png)
![](screenshots/Screenshot%20from%202020-02-29%2002-19-26.png)
![](screenshots/Screenshot%20from%202020-02-29%2019-21-47.png)
![](screenshots/Screenshot%20from%202020-02-29%2019-01-38.png)
![](screenshots/Screenshot%20from%202020-02-29%2019-08-45.png)
![](screenshots/Screenshot%20from%202020-02-29%2019-25-55.png)
![](screenshots/Screenshot%20from%202020-02-29%2019-26-42.png)

## Gif

![](<screenshots/ezgif.com-video-to-gif%20(1).gif>)

## Link to a full video

[Video](https://streamable.com/5srsv)

## Built With

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Redux](https://redux.js.org/) - State managment
- [Semantic UI React](https://react.semantic-ui.com/) - UI
- [Socket.io](https://socket.io/) - Used for realtime features
- [Node](https://nodejs.org/en/) - Used for backend
- [Mongodb](https://www.mongodb.com/) - Database

## Features

- Like posts, comments, replies
- See likes for posts, comments, replies
- Follow, unfollow
- Update user information
- Search users
- Tag people on post and in comments with autocomplete
- Send verification email
- Pagination for home feed, user profile, hashtag page, location page, notifications, comments, replies

### Realtime

- Get notification when someone likes your post, comment, reply, tag you on post or reply on comment
- Chat send text message, image
- Seen feature and activity status of user

## Installing

1. Install dependencies

```
npm i && cd client && npm i && cd ..
```

2. Create variables.env file and replace values with yours

```
NODE_ENV=development
DATABASE="Mongodb Connection String"
JWT_KEY="secretkey"
EMAILUSER="example@gmail.com"
EMAILPASS="example"
HOST="your ip eg. http://192.168.0.14:5000"
ENABLE_SEND_EMAIL="true or false" // false if you don't want to set it up
TEST_DATABASE="testing db"
```

3. Go into `client/src/_services/socketService.js` and replace

```
"/"
```

with your local IP address on port 5000

```
127.0.0.1:5000
```

4. Run project

```
npm run dev
```

## Run with Docker Compose
```
docker compose up --build
```

## Contribute

Show your support by ⭐ the project.
