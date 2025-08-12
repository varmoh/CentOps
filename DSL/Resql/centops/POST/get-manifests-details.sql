SELECT manifest_id,
       name,
       client_id,
       helm_version,
       helm_values,
       created_at,
       updated_at
FROM manifests
WHERE client_id = :client_id::uuid AND manifest_id = CAST(:manifest_id AS BIGINT)
  AND manifest_id IN (SELECT max(manifest_id) from manifests GROUP BY name)
  AND deleted = FALSE;
