INSERT INTO secrets (name,
                     client_id,
                     environment,
                     deleted)
SELECT name,
       client_id,
       environment,
       TRUE
FROM secrets
WHERE id = CAST(:id AS BIGINT) AND client_id = :client_id::uuid
