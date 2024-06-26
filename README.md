# Hourglass v2.5

This is a static webpage, built to be used on a Raspberry Pi and function as a clock and weatherstation. 
Build with Vue.JS, SCSS and using the OpenWeatherMap API. 

Making use of images, provided by https://pexels.com/

Also using icons made by Erik Flowers: https://erikflowers.github.io/weather-icons/

![Hourglass2.5 preview](https://raw.githubusercontent.com/JaxxMoss/hourglass2.5/master/hourglass2.5-preview.jpg)

## This webpage is not responsive

This has been a consious decision. I wanted a page that would run on my Raspberry Pi with a 1080p monitor attached to it. So this page only works on 1920x1080. 
I didn't want to use my time for every other screensize, when I would only use it in this setup.

## Version 2.5

The first version of Hourglass was made with plain HTML, SCSS, JS and the Chart.js library to generate the graph. This version was never truly finished, before I started the second version.

The second version was build with Vue, Vuex and Chart.JS as well. 
This version worked quite well, but was way too performance heavy and even made the Raspberry Pi crash. 

That is why I decided to attempt to generate the Graph with SVG. I was familiar with the format and thought I could draw the SVG with data from the API. 
And it worked! 

Load times were improved by about 30% with scripting time going from 377ms to 73ms. 

It was pretty hard to learn to write SVG and translate data at the same time, but it's a nice skill to have!

## API swap and other future updates

[OpenWeatherMap](https://openweathermap.com/) has served me well for a lot of years, now. But they've decided to terminate the endpoint I was using, so I'm going to swap out the API's and start using [Open-Meteo](https://open-meteo.com/).
This API is open-source and is available to everybody. 

GeoLocation: Might be added in the future. Right now the weather of Utrecht (my hometown) is shown. You can change the latitude and longtitude to get the weather of other places, but this is not really user-friendly. 
So GeoLocation will be added, some day!

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
