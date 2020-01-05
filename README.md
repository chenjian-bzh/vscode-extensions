# vconsole tools extension

the extension is a tool for starting vconsole project in development mode, and also you run debug nodejs process using the given configuration.

## Getting Started

1.  click [here](https://marketplace.visualstudio.com/items?itemName=chenjian-bzh.vconsole) to install the extension, or you can find it in vscode extensions tab, just search for vconsole-bootstrap.

2.  make sure your current workspace or folder contains at least one vconsole project.

3.  use shortcuts: "ctrl + shift + p" , and enter "vconsole", you will see three commands list below:

    - `vconsole.dev`: start web and node development.

    - `vconsole.debug`: start web process and node debug process for you, if thers is no launch.json, a new one will be created.

    - `vconsole.createDebugConfiguration`: create a debug configuration named launch.json in .vscode directory. if launch.json is already exist, this command will do nothing. The new configuration will be like this:

          ```json
          {
              "version": "0.2.0",
              "configurations": [
                  {
                      "type": "node",
                      "request": "launch",
                      "name": "vconsole debug",
                      "env": {
                          "NODE_ENV": "dev",
                          "PORT": "3000",
                          "ROUTE_IP": "10.225.68.88"
                      },
                      "runtimeExecutable": "ts-node-dev",
                      "runtimeArgs": [
                          "--ignore-watch",
                          "typings/auto-generated"
                      ],
                      "args": [
                          "bootstrap.ts"
                      ],
                      "cwd": "${workspaceRoot}/packages/platform",
                      "restart": true,
                      "console": "integratedTerminal",
                      "internalConsoleOptions": "neverOpen"
                  }
              ]
          }
          ```

4.  select a product like ecs or vod for web bootstraping.

## Problem

vscode API do not support [splitting terminal](https://github.com/microsoft/vscode/issues/45407) yet , so web and node process started by the extension will be in two seperated terminals. it may be inconvenient to some degree.
