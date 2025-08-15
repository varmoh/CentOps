INSERT INTO deployments (client_id, manifest_id, manifest_name, manifest_git_helm_branch, status, deployed_by_id_code,
                         deployed_by_username, deployed_by_lastname, argo_deploy_app_name, argo_deployment_id)
VALUES (:client_id::uuid, :manifest_id::uuid, :manifest_name, :manifest_git_helm_branch, :status, :deployed_by_id_code,
        :deployed_by_username, :deployed_by_lastname, :argo_deploy_app_name,CAST(:argo_deployment_id AS UUID))
RETURNING id, status;
