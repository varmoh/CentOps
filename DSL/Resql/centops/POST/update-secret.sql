WITH origin AS (
    UPDATE secrets
        SET deleted = true
        WHERE id = CAST(:id AS BIGINT)
        AND client_id = :client_id::uuid
        RETURNING name, environment, created_at
),
     inserted AS (
         INSERT INTO secrets (client_id, name, environment, created_at, updated_at)
             SELECT :client_id::uuid,
                    origin.name,
                    origin.environment,
                    origin.created_at,
                    NOW()
             FROM origin
             RETURNING id)
SELECT id
FROM inserted;
