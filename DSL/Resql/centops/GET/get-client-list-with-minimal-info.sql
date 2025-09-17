SELECT client_id,
       name,
       authentication_certificate,
       created_at,
       updated_at,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM clients c
WHERE id = (SELECT max(id) FROM clients WHERE client_id = c.client_id)
  AND deleted = FALSE
  AND part_of_network = TRUE
ORDER BY name
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER ) LIMIT :page_size::INTEGER;
