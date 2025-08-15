WITH origin AS (SELECT client_id, name, git_helm_branch, helm_values, git_helm_repository, git_helm_path
                FROM manifests
                WHERE client_id = :client_id::uuid
                  AND manifest_id =:manifest_id::uuid
                  AND deleted = false
                LIMIT 1),
     inserted AS (
         INSERT INTO manifests (client_id, name, git_helm_branch, helm_values, created_at, git_helm_repository, git_helm_path, manifest_id)
             SELECT origin.client_id,
                    CONCAT(origin.name, ' Copy ', TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')),
                    origin.git_helm_branch,
                    origin.helm_values,
                    NOW(),
                    origin.git_helm_repository,
                    origin.git_helm_path,
                    uuid_generate_v4()
             FROM origin
             RETURNING manifest_id)
SELECT manifest_id
FROM inserted;
