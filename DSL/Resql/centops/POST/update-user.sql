INSERT INTO users (user_id, first_name, last_name, id_code, updated_at, created_at)
SELECT user_id, :first_name, :last_name, :id_code, now(), created_at
FROM users
WHERE user_id = :user_id::uuid
AND id IN (SELECT max(id) FROM users WHERE user_id = :user_id::uuid GROUP BY user_id);
