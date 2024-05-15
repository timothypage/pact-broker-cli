const superagent = require('superagent')

const makeRequestToPactBroker = async (method, url, body) => {
  console.log(`making request to pact broker method: ${method} url ${url}`)

  const pactBrokerUrl = process.env.PACT_BROKER_URL
  const pactBrokerUsername = process.env.PACT_BROKER_USERNAME
  const pactBrokerPassword = process.env.PACT_BROKER_PASSWORD

  const urlToQuery = url.includes(pactBrokerUrl) ? url : `${pactBrokerUrl}/${url}`
  const request = superagent(method, urlToQuery)
    .auth(pactBrokerUsername, pactBrokerPassword)
    .set({
      'Content-Type': 'application/json',
    })
  if (body) {
    request.send(body)
  }
  const { body: responseBody } = await request
  return responseBody
}

module.exports = {
  makeRequestToPactBroker,
}
