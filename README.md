# React Weather

[Live on Heroku](https://react-weather228.herokuapp.com/)

## About

This project aims to master newly acquired [React](https://reactjs.org/) skills. Just messing around with basics (like components, props, state etc.) and some advanced topics (e.g. [react-router](https://github.com/ReactTraining/react-router), [react-responsive](https://github.com/contra/react-responsive), environment variables).

## Features

* Fetching 5 day / 3 hour weather forecasts from [OpenWeatherMap API](https://openweathermap.org/api).
* Getting current user position via browser [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).
* Searching locations by city name.
* Fetching suggestions for location search.
* Displaying hourly forecast for each day with routing.

## Local setup

Clone the repo:

```bash
git clone https://github.com/romalenskiy/react-weather.git
```

Install node packages:

```bash
npm install
```

Set up environment variables:

```bash
# In the project root
# Replace "your_api_key" with your OpenWeatherMap API key
echo "REACT_APP_OW_API_KEY=your_api_key" >> .env
```

Run development server:

```bash
npm start
```

Add Heroku remote:

```bash
heroku git:remote -a react-weather101
```