SELECT
    log_id,
    method,
    path,
    created_at,
    user_id_code,
    first_name,
    last_name,
    CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM user_logs l
WHERE l.id = (SELECT max(id) FROM user_logs WHERE log_id = l.log_id)
  AND l.deleted = false
ORDER BY created_at desc
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER ) LIMIT :page_size::INTEGER;
