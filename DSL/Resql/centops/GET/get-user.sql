SELECT user_id,
       first_name,
       last_name,
       id_code,
       created_at,
       updated_at
FROM users
WHERE user_id = :user_id::uuid
AND id IN (SELECT max(id) FROM users WHERE user_id = :user_id::uuid GROUP BY user_id)
AND deleted = false;
