# demo-shop

## Prerequisites

```
Node.js (^12.20.0 || ^14.15.0 || >=16.10.0)

>= 12.20.0, < 13.0
>= 14.15.0, < 15.0
>= 16.10.0
```

## Installation

```bash
# check your node version
$ node -v

# install nvm/node
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
$ nvm ls # see installed
$ nvm ls-remote # sett available to install
$ nvm install version(12.20.0, 14.15.0...)

# change node version
$ nvm ls or nvm install version
$ nvm use version (installed version)

# if command not found: nvm
$ source ~/.nvm/nvm.sh

# install yarn
$ npm i -g yarn

# install project package
$ yarn install
```

## Running the app

```bash
# execute infra
$ docker-compose -f path/to/project/docker/docker-infra.yml up -d

# local
$ yarn run start:local

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run  start:prod
```

## Test

```bash
# unit tests
$ yarn run  test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
