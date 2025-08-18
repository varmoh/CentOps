INSERT INTO deployments (deployment_id,
                         deleted,
                         manifest_git_helm_branch,
                         argo_deploy_app_name,
                         deployed_by_id_code,
                         deployed_by_username,
                         deployed_by_lastname,
                         manifest_name,
                         manifest_id,
                         client_id)
SELECT deployment_id,
       TRUE,
       manifest_git_helm_branch,
       argo_deploy_app_name,
       deployed_by_id_code,
       deployed_by_username,
       deployed_by_lastname,
       manifest_name,
       manifest_id,
       client_id
FROM deployments
WHERE deployment_id = :deployment_id::uuid
  AND id = (SELECT max(id) FROM deployments WHERE deployment_id = :deployment_id::uuid);
