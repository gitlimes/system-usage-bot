# system-usage-bot

a mastodon bot that toots the system usage of the server it runs on (see example toots [here](https://fedi.limes.pink/@system))

### set up

1. clone the repository and install the dependencies (yadda yadda, the usual stuff)

```sh
git clone https://github.com/gitlimes/system-usage-bot.git && \
cd system-usage-bot && \
npm install
```

2. create a .env file by copying/renaming the [.example.env](https://github.com/gitlimes/system-usage-bot/blob/main/.example.env) file to .env

```sh
cp .example.env .env
```

3. fill the .env file with your mastodon instance url (e.g. `https://fedi.limes.pink`) and an app access token with the `write:statuses` scope.

4. make sure to also check the config at the top of the [index.js](https://github.com/gitlimes/system-usage-bot/blob/main/index.js) file for further configuration options!

5. that's all the setup needed to run the bot! congrats, i'm proud of ya :3
   <br>
   <br>

pro tip: here's a pm2 command to run the bot every 30 minutes (at :00 and :30)

```sh
pm2 start index.js --no-autorestart --cron "*/30 * * * *" --name "system-usage-bot"
```

<br>
<br>
<p align="right">made with ❤ by <a href="https://limes.pink" target="_blank">kip (limes.pink)</a></p>
