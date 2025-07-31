WITH origin AS (
    UPDATE manifests
        SET deleted = true
        WHERE client_id = :client_id::uuid AND manifest_id = CAST(:manifest_id AS BIGINT)
        RETURNING created_at, name, helm_values, helm_version, client_id
),
     inserted AS (
         INSERT INTO manifests (client_id, name, helm_version, helm_values, created_at, deployed_at)
             SELECT
                 origin.client_id,
                 origin.name,
                 origin.helm_version,
                 origin.helm_values,
                 origin.created_at,
                 NOW()
             FROM origin
             RETURNING manifest_id
     )
SELECT manifest_id FROM inserted;
