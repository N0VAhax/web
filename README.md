### Getting sources and install node modules

    git clone https://github.com/m-k-S/poc-engine
    cd poc-engine
    npm install

### Database build

1. Create database called pocgamedb_test on postgresql
2. Run below command to create tables
    `psql -U postgres pocgamedb_test < poc-engine/server/sql/schema.sql`

### Start locally

    npm start

    It will run game server on 127.0.0.1:4000 # current recatcha is built for 127.0.0.1 not localhost so run using 127.0.0.1:4000

1. Register users on http://127.0.0.1:4000/register     
2. To give user admin role, edit the database/users table manually on NaviCat or something that can manage postgresql
3. Create a row on database/fundings, amount field as 100000000000
4. And to give user some test tokens, goto http://127.0.0.1:4000/admin-giveaway and enter usernames and amount there.


### Connecting with Gameserver

After running Gameserver at https://github.com/m-k-S/poc-game do below steps

1. Login as admin user and goto http://127.0.0.1:4000/admin
2. Click Resume Game button
3. It will automatically play game
4. Playing is done on http://127.0.0.1:4000/play-old # or click play button on http://127.0.0.1:4000

# Warning


sudo -u postgres psql
\c pocgamedb_test;
SELECT * from users;
UPDATE users SET userclass = 'admin';

When deploy to server, socket.io version can have issue
- npm update
- npm install
- npm r socket.io
- npm r socket.io-client
- npm r socket.io-cookie
- npm i socket.io@1.3.6
- npm i socket.io-client@1.3.5
- npm i socket.io-cookie@0.0.1

forever start -o log/out.log -e log/err.log server/index.js


