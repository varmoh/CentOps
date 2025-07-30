INSERT INTO clusters (cluster_id, name, ip_address, updated_at, created_at)
SELECT cluster_id, :name, :ip_address, now(), created_at
FROM clusters
WHERE cluster_id = :cluster_id::uuid
  AND id = (SELECT max(id) FROM clusters WHERE cluster_id = :cluster_id::uuid);
