SELECT client_id,
       name,
       authentication_certificate,
       created_at,
       updated_at,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM clients c
WHERE c.id IN (
    SELECT MAX(id)
    FROM clients
    WHERE deleted = FALSE
      AND part_of_network = TRUE
    GROUP BY client_id
)
ORDER BY name
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER)
LIMIT :page_size::INTEGER;
