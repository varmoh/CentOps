INSERT INTO manifests (name,
                       client_id,
                       manifest_id,
                       git_helm_branch,
                       helm_values,
                       deleted,
                       created_at,
                       git_helm_repository,
                       git_helm_path
)
SELECT name,
       client_id,
       manifest_id,
       git_helm_branch,
       helm_values,
       TRUE,
       NOW(),
       git_helm_repository,
       git_helm_path
FROM manifests
WHERE manifest_id = :manifest_id::uuid AND client_id = :client_id::uuid;
