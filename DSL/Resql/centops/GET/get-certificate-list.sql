SELECT certificate_id,
       client_id,
       created_at,
       revoked,
       deleted,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM certificates c
WHERE c.client_id = :client_id::uuid AND deleted=false
  AND c.id = (SELECT max(id) FROM certificates WHERE certificate_id = c.certificate_id)
ORDER BY id
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER ) LIMIT :page_size::INTEGER;
