SELECT cluster_id,
       name,
       ip_address,
       created_at,
       updated_at
FROM clusters
WHERE cluster_id = :cluster_id::uuid
  AND id = (SELECT max(id) FROM clusters WHERE cluster_id = :cluster_id::uuid)
  AND deleted = false;
