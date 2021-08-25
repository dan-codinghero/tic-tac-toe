# Tic-Tac-Toe - Coding Challenge.

This repository contains source code for the classic Tic-Tac-Toe using socket.io to allow play online.

## How to use

Download/Clone the project

-   API

    -   Create a **.env** file in root directory of api folder and add the entries below  
        PORT = 'Port for application. Default to 9000 if no value is provided'  
        ALLOW_ORIGINS = "Configures requesting origin. Default '\*' if no value is provided"

    -   Run **npm install**
    -   Run **npm start** to start project

-   Client

    -   Create **.env.local** file in root directory of client folder and add the entries below  
        REACT_APP_SOCKET_IO_SERVER = 'http://localhost:**PORT NUMBER FROM API**'

    -   Run **npm install**
    -   Run **npm start** to start project
