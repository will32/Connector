# Connector
Connect to api and observe the response changes, like long polling

## Usage
Create the observable connector by providing config to the module:
```Javascript
const observable = connector(config);
```

config has the following properties:

| Attribute | Type | Required | Description |
|:----------|:-----|:---------|:------------|
|ajaxClient|any|no|client that initiate connection to server side, default to [axios](https://www.npmjs.com/package/axios)|
|ajaxConfig|any|no|args provide to ajax client, default to {}|
|comparer|function|no|comparer used to compare old response with new response to detect changes, default to deep compare response.data|
|period|number|no|time between each ajax call in **ms**, default to 1000ms|
|canceler|function|no|return true when need to stop the observation, default to always return false|
