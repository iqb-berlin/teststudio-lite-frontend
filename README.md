[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
![GitHub tag (latest SemVer)](https://img.shields.io/github/v/tag/iqb-berlin/teststudio-lite-frontend?style=flat-square)

# Teststudio-Lite Frontend

Thes is the frontend for the Teststudio-Lite application (formally known as itemdb).

You can find the backend for this application [here](https://github.com/iqb-berlin/teststudio-lite-backend).
You can find a complete setup with front- and backend [here](https://github.com/iqb-berlin/teststudio-lite-setup).

## Bug Reports

Please file bug reports etc. here [here](https://github.com/iqb-berlin/teststudio-lite-frontend/issues).

## Installation

### With Docker (recommended)

All necessary commands for running the application can be found in the Makefile on the root directory. It is recommended to use those Makefile-targets. If you don't want to use `make`, you may manually execute the commands in this file.

A production-ready container can be downloaded [here](https://hub.docker.com/repository/docker/iqbberlin/teststudio-lite-frontend)

###### Start and Stop the server
This setup is for local development. You can build and start the image(s) with the following commands.
```
make run
make stop
```

To run docker in the background you may use
```
make run-detached
```

### Manual

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

To create a new tag in git and tagged docker images on Docker Hub, you the Makefile targets:
```
new-version-major/minor/patch
```
