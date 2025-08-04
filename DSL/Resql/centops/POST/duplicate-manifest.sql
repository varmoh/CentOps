WITH origin AS (SELECT client_id, name, helm_version, helm_values
                FROM manifests
                WHERE client_id = :client_id::uuid
                  AND manifest_id = CAST(:manifest_id AS BIGINT)
                  AND deleted = false
                LIMIT 1),
     inserted AS (
         INSERT INTO manifests (client_id, name, helm_version, helm_values, created_at)
             SELECT origin.client_id,
                    CONCAT(origin.name, ' Copy ', TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')),
                    origin.helm_version,
                    origin.helm_values,
                    NOW()
             FROM origin
             RETURNING manifest_id)
SELECT manifest_id
FROM inserted;
