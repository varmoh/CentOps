SELECT id,
       client_id,
       manifest_version,
       deployed_by_id_code,
       argo_deploy_app_name,
       concat(deployed_by_username, ' ', deployed_by_lastname) as deployed_by,
       status,
       created_at,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM deployments
WHERE client_id = :client_id::uuid
ORDER BY created_at DESC
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER ) LIMIT :page_size::INTEGER;
