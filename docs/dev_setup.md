# CentOps

Bürokratt Central Operations

### Dev environment setup

- Run setup-components.sh to setup to clone & build the images for all components `./setup-components.sh`

- Run `docker compose up -d`

##### Notes

- If you made changes to ruuter, rebuild the image again using `docker build -t ruuter .`

- If you made changes to resql, rebuild the image again using `docker build -t resql .`

- If you made changes to tim, rebuild the image again using `docker build -t tim .`

- If you made changes to data mapper, rebuild the image again using `docker build -t data-mapper .`

- Ruuter configuration should be changed for all the endpoints to work. PUT and DELETE should be added to the allowedMethodTypes array. See more information https://github.com/buerokratt/Ruuter/blob/65889552329249665e48656ed866cdf99cda391f/samples/CONFIGURATION.md

##### Public Acccessed Pages

- Application: `{YOUR URL}/centops/application`
- Application With ID: `{YOUR URL}/centops/application/{APPLICATION ID}`
- Overview: `{YOUR URL}/centops/overview`
- Form: `{YOUR URL}/centops/form`
- Past Updates: `{YOUR URL}/centops/manifests/past_updates`
- Future Updates: `{YOUR URL}/centops/manifests/future_updates`

### Database setup
- Run centops migrations in this repository by running the helper script `./migrate.sh`
- Run users migrations in this repository by running the helper script `./migrate-users.sh`
- To seed users with dummy users, run `./seed-users.sh`
- When creating centops new migrations, use the helper `./create-migration.sh name-of-migration` which will create a timestamped file in the correct directory and add the required headers
- When creating users new migrations, use the helper `./create-migration-users.sh name-of-migration` which will create a timestamped file in the correct directory and add the required headers

### TIM

- If you are running `Locally` then you need to curl the login request or run it on postman first to create and store the cookie in TIM and then on the browser create the cookie manully in the browser with name `customJwtCookie` and the value return from the curl
the curl request is as follows:
```
curl -X POST -H "Content-Type: application/json" -d '{
  "login": "EE30303039914",
  "password": "OK"
}' http://localhost:8050/centops/auth/login
```

### Vault Setup 

see the [README](./vault/README.md) file.

### API Clients

- To insert a new API client, you need to hash the `API_KEY` and `API_SECRET` using `pgcrypto`.

- Run the following SQL script:

```sql
INSERT INTO API_CLIENTS(API_KEY, API_SECRET)
VALUES ('testApiKey',
        crypt('testApiSecret', gen_salt('bf', 8)));
```
