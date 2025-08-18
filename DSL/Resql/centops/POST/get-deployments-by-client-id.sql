SELECT id,
       client_id,
       deployment_id,
       manifest_id,
       manifest_name,
       manifest_git_helm_branch,
       deployed_by_id_code,
       argo_deploy_app_name,
       concat(deployed_by_username, ' ', deployed_by_lastname) as deployed_by,
       status,
       created_at,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL)             AS total_pages
FROM deployments d
WHERE id = (SELECT max(id) FROM deployments WHERE deployment_id = d.deployment_id AND client_id = :client_id::uuid)
  AND deleted = FALSE
ORDER BY created_at DESC
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER ) LIMIT :page_size::INTEGER;
