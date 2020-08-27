# Cows Distribution -- Frontend Application

The aim of the project was to create the application to visualize the distribution of cows in the barn. This application offers two main views: distribution of cows in grid-like view and distributions in the areas within the range of sensors.

This application is the frontend part of the project.

# Documentation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.14.

Additional tips added by Rafał Kocoń.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Additional server configurations (RK)

Run `ng serve -c prodDebug` for serving application for testing/development purposes (development mode).

Run `ng serve -c prod` for production (difference: added optimalization, which prolongs compilation time).

Run `ng serve -c devDebug` for development purposes, especially to work with locally created server by `json-server`.

## Generating components

Run `ng generate c component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

(RK) Root-path (/) for generating purposes is src/app. For example, to generate component in 'src/app/base' you should type:

`ng g c base/component-name`

## Serving fake server

To build `stricted-position` generated local server:

1) Create .js file from .ts with command:
`tsc src/assets/json-server/stricted-position.ts`
2) Build .json with created .js file: `node src/assets/json-server/stricted-position.js`
3) Run `json-server`: `json-server stricted-position.json`

It is recommended to install  `json-server` globally, so it is easily accessible from command line.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
