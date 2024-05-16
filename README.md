a "fork" of @rplan/pact-broker-cli, which was removed from npm

# Pact Broker Client

A client for Pact Broker. Publishes, creates webhooks, verifies pacts. The functionality is available via a CLI.

## Installation

### Install CLI

`npm install pact-broker-cli`

### Usage

`npx pact-broker-cli ..args`

## Setup

To connect to a Pact Broker you have to export the pact broker credentials

```
export PACT_BROKER_URL=https://example-pact-broker.example.com
export PACT_BROKER_USERNAME=pact-broker-user-example
export PACT_BROKER_PASSWORD=pact-password
```

## Commands

### createWebhookIfNotExists

```
Usage:
  npx pact-broker-cli createWebhookIfNotExists --consumerName=accounts --providerName=authentication --webhookTargetUrl=https://rplan.com/jenkins/build/master

Options:
  --consumerName                                            # The name of the consumer. Pact changes from this build cause the webhook to be fired.
  --providerName                                            # The name of the provider. Pact changes from the consumer cause this build to be fired.
  --webhookTargetHttpMethod ['GET', 'PUT', 'POST']          # The http method the webhook should use when triggered
                                                            # Default: POST               
  --webhookTargetUrl                                        # The url the webhook should use when triggered
  --webhookTargetWithBasicAuth                              # Pass basic auth credentials in the webhook call
                                                            # Default: false
  --webhookTargetBasicAuthUsername                          # Username for basic auth if needed
  --webhookTargetBasicAuthPassword                          # Password for basic auth if needed
  --force                                                   # Always create the webhook, whether it exists or not

Description:
    Creates a webhook to the Pact Broker.
```

### publish

```
Usage:
  npx pact-broker-cli publish --pactFilesOrDirs=./pacts --consumerVersion=1.0.0 --tags=master

Options:
  --pactFilesOrDirs                                        # Array of local Pact files or directories containing them
  --consumerVersion                                        # A string containing a semver-style version, e.g. 1.0.0
  --tags                                                   # An array of strings to tag the Pacts being published

Description:
    Publishes pacts to the pact broker.
```

### canIDeploy

```
Usage:
  npx pact-broker-cli canIDeploy --pacticipants=accounts:1.0.0 --retryWhileUnknown=36 --retryInterval=15 --timeout=600

Options:
  --pacticipants                           # Array of participant names with participant version
  --output                                 # Specify output to show, json or table
                                           # Default: table
  --verbose                                # Set the logging mode to verbose
                                           # Default: false
  --retryWhileUnknown                      # The number of times to retry while there is an unknown verification result
                                           # Default: 0
  --retryInterval                          # The time between retries in seconds, use with retryWhileUnknown
                                           # Default: 0
  --timeout                                # Timeout for retrying can i deploy check in seconds
                                           # Default: 60
  --tag                                    # The tag you want to deploy to

Description:
  Returns exit code 0 or 1, indicating whether or not the specified pacticipant versions are compatible. Prints out the relevant
  pact/verification details.

  The environment variables PACT_BROKER_BASE_URL, PACT_BROKER_BASE_URL_USERNAME and PACT_BROKER_BASE_URL_PASSWORD may be used
  instead of their respective command line options.
```
