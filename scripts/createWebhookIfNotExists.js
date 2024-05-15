const { makeRequestToPactBroker } = require('./makeRequestToPactBroker')

const getWebhookUrlForConsumerProducerRelationship = (consumerName, providerName) => `pacts/provider/${providerName}/consumer/${consumerName}/webhooks`

const doesWebhookExist = async ({
  consumerName,
  providerName,
  webhookTargetUrl,
  webhookTargetHttpMethod,
}) => {
  const url = getWebhookUrlForConsumerProducerRelationship(consumerName, providerName)
  const body = await makeRequestToPactBroker('GET', url)
  const webhooks = await Promise.all(
    body._links['pb:webhooks'].map(async ({ href }) => {
      const {
        request: { url: webhookUrl, method },
      } = await makeRequestToPactBroker('GET', href)

      return {
        webhookUrl,
        method,
      }
    }),
  )
  const returnValue = !!webhooks.find(
    ({ webhookUrl, method }) =>
      webhookUrl.includes(webhookTargetUrl) && method === webhookTargetHttpMethod,
  )
  return returnValue
}

const createWebhook = async ({
  consumerName,
  providerName,
  webhookTargetHttpMethod,
  webhookTargetUrl,
  webhookTargetWithBasicAuth,
  webhookTargetUsername,
  webhookTargetPassword,
}) => {
  const url = `pacts/provider/${providerName}/consumer/${consumerName}/webhooks`

  const requestBody = {
    events: [{
      name: 'contract_content_changed',
    }],
    request: {
      method: webhookTargetHttpMethod,
      url: webhookTargetWithBasicAuth ? `${webhookTargetUrl}?auth_type="basic"` : webhookTargetUrl,
      username: webhookTargetUsername,
      password: webhookTargetPassword,
    },
  }
  await makeRequestToPactBroker('POST', url, requestBody)
  console.log('webhook created')
}

const handler = async ({
  consumerName,
  providerName,
  webhookTargetHttpMethod,
  webhookTargetUrl,
  webhookTargetWithBasicAuth,
  webhookTargetUsername,
  webhookTargetPassword,
  force,
}) => {
  try {
    const webhookAlreadyExists = await doesWebhookExist({
      consumerName,
      providerName,
      webhookTargetUrl,
      webhookTargetHttpMethod,
    })

    if (webhookAlreadyExists && !force) {
      console.log(
        `The webhook between consumer: ${consumerName} and provider: ${providerName} already exists. To force create this use --force.`,
      )
      return
    }

    if (webhookAlreadyExists && force) {
      console.log(
        `The webhook between consumer: ${consumerName} and provider: ${providerName} already exists. You specified force, creating webhook anyway.`,
      )
    }

    console.log(
      `Creating webhook for consumer: ${consumerName} and provider: ${providerName}.`,
    )

    await createWebhook({
      consumerName,
      providerName,
      webhookTargetHttpMethod,
      webhookTargetUrl,
      webhookTargetWithBasicAuth,
      webhookTargetUsername,
      webhookTargetPassword,
    })
    process.exit(0)
  } catch (err) {
    console.log(err.stack)
    process.exit(1)
  }
}

const builder = yargs => yargs
  .usage('Creates a pact-broker webhook if the webhook does not already exist')
  .option('consumerName', {
    describe:
    'The name of the consumer. Pact changes from this build cause the webhook to be fired.',
    demandOption: true,
  })
  .option('providerName', {
    describe:
    'The name of the provider. Pact changes from the consumer cause this build to be fired',
    demandOption: true,
  })
  .option('webhookTargetHttpMethod', {
    describe: 'The http method the webhook should use when triggered',
    demandOption: false,
    choices: ['GET', 'PUT', 'POST'],
    default: 'POST',
  })
  .option('webhookTargetUrl', {
    describe: 'The url the webhook should use when triggered',
    demandOption: true,
  })
  .option('webhookTargetWithBasicAuth', {
    describe: 'Pass basic auth credentials in the webhook call',
    demandOption: false,
    default: false,
  })
  .option('webhookTargetUsername', {
    describe: 'Username for basic auth if needed',
    demandOption: false,
  })
  .option('webhookTargetPassword', {
    describe: 'Password for basic auth if needed',
    demandOption: false,
  })
  .option('force', {
    describe: 'Always create the webhook, regardless of if it exists or not',
    demandOption: false,
    type: 'boolean',
    default: false,
  })
  .version(false)
  .help('help')

module.exports = {
  desc: 'create a webhook if it does not exist',
  command: 'createWebhookIfNotExists',
  builder,
  handler,
}
