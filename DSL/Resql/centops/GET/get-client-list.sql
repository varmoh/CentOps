SELECT client_id,
       name,
       kubernetes_cluster_id,
       kubernetes_cluster_namespace,
       authentication_certificate,
       created_at,
       updated_at,
       part_of_network,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM clients c
WHERE id = (SELECT max(id) FROM clients WHERE client_id = c.client_id)
  AND deleted = FALSE
ORDER BY name
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER ) LIMIT :page_size::INTEGER;
