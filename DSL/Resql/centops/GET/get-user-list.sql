SELECT user_id,
       first_name,
       last_name,
       id_code,
       created_at,
       updated_at,
       CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM users u
WHERE u.id = (SELECT max(id) FROM users WHERE user_id = u.user_id)
  AND u.deleted = false
ORDER BY id
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER ) LIMIT :page_size::INTEGER;
