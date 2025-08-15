SELECT manifest_id,
       name,
       client_id,
       git_helm_branch,
       helm_values,
       created_at,
       updated_at,
       git_helm_repository,
       git_helm_path
FROM manifests
WHERE client_id = :client_id::uuid AND manifest_id = :manifest_id::uuid
  AND id IN (SELECT max(id) from manifests GROUP BY name)
  AND deleted = FALSE;
