INSERT INTO clusters (cluster_id, deleted)
SELECT cluster_id, true
FROM clusters
WHERE cluster_id = :cluster_id::uuid
  AND id = (SELECT max(id) FROM clusters WHERE cluster_id = :cluster_id::uuid)
  AND deleted = false;
