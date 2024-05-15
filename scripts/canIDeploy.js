const pact = require('@pact-foundation/pact-node')

const handler = async ({ tag, timeout, ...args }) => {
  const opts = {
    ...args,
    to: tag,
    timeout: timeout * 1000,
    pactBroker: process.env.PACT_BROKER_URL,
    pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
    pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
  }
  await pact.canDeploy(opts)
}

const builder = yargs => yargs
  .usage('Publishes pacts to the pact broker')
  .option('pacticipants', {
    describe: 'Array of participant names',
    demandOption: true,
    type: 'array',
  })
  .option('output', {
    describe: 'Specify output to show, json or table',
    demandOption: false,
    type: 'string',
    choices: ['json', 'table'],
    default: 'table',
  })
  .option('verbose', {
    describe: 'Set the logging mode to verbose',
    demandOption: false,
    default: false,
    type: 'boolean',
  })
  .option('retryWhileUnknown', {
    describe: 'The number of times to retry while there is an unknown verification result',
    demandOption: false,
    default: 0,
    type: 'number',
  })
  .option('retryInterval', {
    describe: 'The time between retries in seconds, use with retryWhileUnknown',
    demandOption: false,
    default: 0,
    type: 'number',
  })
  .option('timeout', {
    describe: 'Timeout for retrying can i deploy check in seconds',
    demandOption: false,
    default: 60,
    type: 'number',
  })
  .option('tag', {
    describe: 'The tag you want to deploy to',
    demandOption: false,
    type: 'string',
  })
  .check(({ pacticipants }) => {
    pacticipants.forEach(({ name, version }) => {
      if (!name || !version) {
        throw new Error('Participants must be in the format <name>:<version>')
      }
    })
    return true
  })
  .coerce('pacticipants', pacticipants => pacticipants.map((pacticipant) => {
    const pacticipantValue = pacticipant.split(':')
    return {
      name: pacticipantValue[0],
      version: pacticipantValue[1],
    }
  }))
  .version(false)
  .help('help')

module.exports = {
  command: 'canIDeploy',
  desc: 'Check if you can deploy a specific service',
  builder,
  handler,
}
