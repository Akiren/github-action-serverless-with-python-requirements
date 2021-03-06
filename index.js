//  Packages
var core = require('@actions/core')
var execSync = require('child_process').execSync
code = execSync('sudo npm install exeq --save')
var exeq = require('exeq')

//  Environment Vars
var ARGS = core.getInput('args')
var AWS_ACCESS_KEY_ID = core.getInput('aws-access-key-id')
var AWS_SECRET_ACCESS_KEY = core.getInput('aws-secret-access-key')


//  Reinstalls Docker on Ubuntu
async function installDocker() {
  await exeq(
    'echo Installing docker...',
    'sudo apt-get install docker.io -y',
    'sudo systemctl unmask docker',
    'sudo systemctl start docker'
  )
}

//  Installs Serverless and specified plugins
async function installServerlessAndPlugins() {
  await exeq(
    'echo Installing Serverless and plugins...',
    'sudo npm i serverless -g',
    'sudo npm i serverless-python-requirements'
  )
}

//  Runs Serverless deploy including any provided args
async function runServerlessDeploy() {
  await exeq(
    `echo Running sudo sls deploy ${ARGS}...`,
    `sudo serverless config credentials --provider aws --key ${AWS_ACCESS_KEY_ID} --secret ${AWS_SECRET_ACCESS_KEY} ${ARGS}`,
    `sudo serverless deploy ${ARGS}`
  )
}

//  Runs all functions in sequence
async function handler() {
  await installDocker()
  await installServerlessAndPlugins()
  await runServerlessDeploy()
}

//  Main function
if (require.main === module) {
  handler()
}
