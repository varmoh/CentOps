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
    SPLIT_PART(secret_key, '/', -1) || ' (' || SPLIT_PART(secret_key, '/', -2) || ')' AS secret_name,
    CEIL(COUNT(*) OVER() / :page_size::DECIMAL) AS total_pages
FROM vault_api_action_log
ORDER BY created_at desc
OFFSET ((GREATEST(:page::INTEGER, 1) - 1) * :page_size::INTEGER ) LIMIT :page_size::INTEGER;
