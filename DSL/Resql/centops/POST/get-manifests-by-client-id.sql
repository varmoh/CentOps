SELECT manifest_id,
       client_id,
       name,
       git_helm_branch,
       created_at,
       updated_at,
       deployed_at,
       git_helm_repository,
       git_helm_path,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM manifests
WHERE client_id = :client_id::uuid
  AND id IN (SELECT max(id) from manifests GROUP BY name)
  AND deleted = FALSE
ORDER BY created_at DESC
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER ) LIMIT :page_size::INTEGER;
