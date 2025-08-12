SELECT EXISTS (
    SELECT 1
    FROM secrets s
    WHERE s.id = (
        SELECT MAX(id)
        FROM secrets
        WHERE client_id = :client_id::uuid
          AND name = :name
          AND environment = :environment
    )
      AND s.deleted = FALSE
) AS secretExist;
