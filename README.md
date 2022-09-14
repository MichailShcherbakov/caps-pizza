<h1 align="center">🍕Caps Pizza</h1>
<p align="center">
  <a href='https://github.com/MichailShcherbakov/caps-pizza/actions/workflows/test.yml'>
    <img src='https://github.com/MichailShcherbakov/caps-pizza/actions/workflows/test.yml/badge.svg?branch=master' alt='Ci Status' />
  </a>
  <a href='https://coveralls.io/github/MichailShcherbakov/caps-pizza?branch=develop'>
    <img src='https://coveralls.io/repos/github/MichailShcherbakov/caps-pizza/badge.svg?branch=develop' alt='Coverage Status' />
  </a>
  <img alt="GitHub" src="https://img.shields.io/github/license/MichailShcherbakov/caps-pizza">
<p>

## 🎨 Preview

<img alt src="https://github.com//MichailShcherbakov/caps-pizza/blob/master/.github/screenshots/main.png?raw=true" />

## 🚀 Quick Start

1. Create in the root directory a file `.env` by sample `.env.example`

```sh
HOST=your_host_name

API_SECRET=your_frontpad_secret_key

JWT_ACCESS_TOKEN_SECRET=any_random_secret_key
JWT_REFRESH_TOKEN_SECRET=any_random_secret_key

DATABASE_NAME=db_name
DATABASE_USERNAME=db_username
DATABASE_PASSWORD=db_password
```

2. Next, run the following command:
```sh
docker compose --file docker-compose.prod.yml up --build
```
## ⚒ Stack

<h4>API</h4>

- NestJS
- Typeorm
- PostgreSQL

<h4>Web</h4>

- NextJS
- Redux Toolkit (RTK Query)
- Material Design
- Formik

## 👨🏻‍💻 Author
<a href="https://github.com/MichailShcherbakov" style="border-radius: 50%; overflow: 'hidden';">
  <img src="https://avatars.githubusercontent.com/u/50011226?s=96&v=4" style="width: 44px"/>
</a>