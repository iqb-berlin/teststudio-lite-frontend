[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

# Teststudio-Lite Frontend

Thes is the frontend for the Teststudio-Lite application (formally known as itemdb).

You can find the backend for this application [here](https://github.com/iqb-berlin/teststudio-lite-backend).

## Bug Reports

Please file bug reports etc. here [here](https://github.com/iqb-berlin/teststudio-lite-frontend/issues).

## Installation

### With Docker (recommended)

You can find Docker files and a complete setup [here](https://github.com/iqb-berlin/testcenter-setup). 

### Manually

**Warning this application is not in active development currently and therefore employs outdated dependencies. 
We take not any warranties and don't recommend putting your instance on a publicly reachable server.**

- Set up the [backend](https://github.com/iqb-berlin/teststudio-lite-backend).
- edit `src/environments/environment.ts` and insert the URL of the Backend.
- Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. 
Use the `--prod` flag for a production build.
- Copy contents of dist directory to your desired webserver-folder.  

#### Development server

Alternatively to building and serve with Apache2 you can run `ng serve` for a dev server. 
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of 
the source files.

## Development

This project is not under active development currently. Only critical bugfixes will be done.
