SELECT cluster_id,
       name,
       ip_address,
       created_at,
       updated_at,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM clusters c
WHERE c.id = (SELECT max(id) FROM clusters WHERE cluster_id = c.cluster_id)
  AND c.deleted = false
ORDER BY name
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER ) LIMIT :page_size::INTEGER;
