[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Custom badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fverona-interfaces%2Fintroduction%2Fmaster%2Fshields.io.json)](https://github.com/verona-interfaces)


**Deutsch: Bitte nutzen Sie das [Wiki](https://github.com/iqb-berlin/teststudio-lite-frontend/wiki). Hier finden Sie 
 Erläuterungen und Präsentationen rund um das IQB-Teststudio.**

# IQB-Teststudio

IQB-Teststudio is a web application for developing test units (old name `itemdb`). In order to run tests or 
surveys with IQB-Testcenter web application, one must supply units as the main part of testing material. After 
editing/authoring, the units are exported as files for the IQB-Testcenter upload.  

# Lite

The suffix `lite` marks this application as a lightweight variant of the full featured application (coming soon). We built this 
lite application as a first draft and prototype to be able to produce some units. After starting the development of 
the full featured application in 2021, we'll continue to develop this application as an easy-to-setup and easy-to-use editor 
for IQB units. 

This repository contains of the full source code for the Angular frontend application. For the backend (php) source code please go 
to the [backend repository](https://github.com/iqb-berlin/teststudio-lite-backend).
 
# Verona

This application complies to the [Verona Interface Specifications](https://github.com/verona-interfaces). We implement the
 editor interface for editing and the player interface for unit preview. 

## Bug Reports

If you have any problems installing or using the application feel free to contact the IQB! **This application is not ready for 
production mode** so please do not rely on features until you have tested it properly. Please file bug reports 
etc. [here](https://github.com/iqb-berlin/teststudio-lite-frontend/issues).

## Setup
#### Docker
 You can find Docker files and a complete 
setup [here](https://github.com/iqb-berlin/testcenter-setup). 

#### Manually 
- Set up the [backend](https://github.com/iqb-berlin/teststudio-lite-backend).
- edit `src/environments/environment.ts` and insert the URL of the Backend.
- Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. 
Use the `--prod` flag for a production build.
- Copy contents of dist directory to your desired webserver-folder.  
