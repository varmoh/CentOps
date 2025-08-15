WITH origin AS (
    UPDATE manifests
        SET deleted = true
        WHERE client_id = :client_id::uuid
            AND manifest_id = :manifest_id::uuid
            AND deleted = false
        RETURNING client_id, manifest_id, name, git_helm_branch, helm_values, created_at, git_helm_repository, git_helm_path)
INSERT INTO manifests (client_id,
                manifest_id,
                name,
                git_helm_branch,
                helm_values,
                created_at,
                deployed_at,
                git_helm_repository,
                git_helm_path)
SELECT client_id,
       manifest_id,
       name,
       git_helm_branch,
       helm_values,
       created_at,
       NOW(),
       git_helm_repository,
       git_helm_path
FROM origin
RETURNING manifest_id;
