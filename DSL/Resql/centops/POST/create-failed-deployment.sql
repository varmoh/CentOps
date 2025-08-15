INSERT INTO deployments (client_id, manifest_id, manifest_name, manifest_git_helm_branch, status, deployed_by_id_code,
                         deployed_by_username, deployed_by_lastname, argo_deploy_app_name, argo_deploy_err_message)
VALUES (:client_id::uuid, :manifest_id::uuid, :manifest_name, :manifest_git_helm_branch, :status, :deployed_by_id_code,
        :deployed_by_username, :deployed_by_lastname, :argo_deploy_app_name, :argo_deploy_err_message)
RETURNING id, status;
