# Distpach GH Actions using Commands

<!-- TODO

// Get workflow ID
$ gh api repos/jossemargt-cto-ai/bati-dora/actions/workflows

// Trigger workflow
$ REPO=jossemargt-cto-ai/bati-dora
$ WORKFLOW_ID=34791838
$
$ curl -XPOST -u "${GH_USER}:${GH_TOKEN}" \
  -H "Accept: application/vnd.github.everest-preview+json"  \
  -H "Content-Type: application/json" \
  https://api.github.com/repos/$REPO/actions/workflows/34791838/dispatches \
  --data '{ "ref": "master", "inputs": {"logLevel": "debug", "selector": "real time"}}'

-->
