SELECT
    id,
    created_at,
    user_id_code,
    ip_address,
    action,
    user_agent,
    first_name,
    last_name,
    client_name,
    CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM vault_api_action_log
ORDER BY id
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER ) LIMIT :page_size::INTEGER;
