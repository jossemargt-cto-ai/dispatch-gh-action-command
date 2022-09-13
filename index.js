const { ux, sdk } = require('@cto.ai/sdk');
const process = require('process');

// The following lines were adapted from
// https://github.com/benc-uk/workflow-dispatch/blob/master/src/main.ts
//
// Basically it:
//  - Uses sdk inputs instead of `core.getInput`
//  - Uses sdk messaging instead of octokit alternative
//
const github = require('@actions/github');

async function main() {
  const { repoName } = await ux.prompt({
    type: "input",
    name: "repoName",
    flag: "r",
    message: "Repository full name",
    default: "jossemargt-cto-ai/bati-dora"
  });

  const [owner, repo] = repoName.split('/')

  const { ref } = await ux.prompt({
    type: "input",
    name: "ref",
    message: "Repository branch",
    default: "master"
  });

  const { workflowRef } = await ux.prompt({
    type: "input",
    name: "workflowRef",
    message: "Workflow name or ID",
    default: "34791838"
  });

  const { token } = await ux.prompt({
    type: "secret",
    name: "token",
    message: "GitHub token",
  });

  if (token.length < 1) {
    await ux.print("Empty token")
    return;
  }

  const { selector } = await ux.prompt({
    type: "input",
    name: "selector",
    message: "Selector value",
    default: "A Command"
  });

  const inputs = { selector }

  // Get octokit client for making API calls
  const octokit = github.getOctokit(token)

  sdk.log({ owner, repo, ref, inputs, token })

  // List workflows via API, and handle paginated results
  const workflows =
    await octokit.paginate(octokit.actions.listRepoWorkflows.endpoint.merge({ owner, repo, ref, inputs }))

  // Locate workflow either by name or id
  const workflowFind = workflows.find((workflow) => workflow.name === workflowRef || workflow.id.toString() === workflowRef)
  if (!workflowFind) throw new Error(`Unable to find workflow '${workflowRef}' in ${owner}/${repo} 😥`)

  sdk.log(`Workflow id is: ${workflowFind.id}`)

  // Call workflow_dispatch API
  const dispatchResp = await octokit.request(`POST /repos/${owner}/${repo}/actions/workflows/${workflowFind.id}/dispatches`, {
    ref: ref,
    inputs: inputs
  })

  await ux.print(`API response status: ${dispatchResp.status} 🚀`)
}

main().catch(err => {
  sdk.log(err);
  process.exit(1);
});
