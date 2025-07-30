SELECT manifest_id,
       client_id,
       name,
       helm_version,
       created_at,
       updated_at,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM manifests
WHERE client_id = :client_id::uuid
  AND manifest_id IN (SELECT max(manifest_id) from manifests GROUP BY helm_version)
  AND deleted = FALSE
ORDER BY created_at DESC
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER ) LIMIT :page_size::INTEGER;
