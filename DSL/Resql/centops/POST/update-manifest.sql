WITH origin AS (
    UPDATE manifests
        SET deleted = true
        WHERE client_id = :client_id::uuid AND manifest_id = CAST(:manifest_id AS BIGINT)
        RETURNING created_at, deployed_at
),
     inserted AS (
         INSERT INTO manifests (client_id, name, helm_version, helm_values, created_at, updated_at, deployed_at)
             SELECT
                 :client_id::uuid,
                 :name,
                 :helm_version,
                 :helm_values,
                 origin.created_at,
                 NOW(),
                 origin.deployed_at
             FROM origin
             RETURNING manifest_id
     )
SELECT manifest_id FROM inserted;
