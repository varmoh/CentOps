WITH origin AS (
    UPDATE manifests
        SET deleted = true
        WHERE client_id = :client_id::uuid AND manifest_id = :manifest_id::uuid
        RETURNING created_at, deployed_at, manifest_id
),
     inserted AS (
         INSERT INTO manifests (client_id, manifest_id, name, git_helm_branch, helm_values, created_at, updated_at, deployed_at, git_helm_repository, git_helm_path)
             SELECT
                :client_id::uuid,
                 origin.manifest_id,
                 :name,
                 :git_helm_branch,
                 :helm_values,
                 origin.created_at,
                 NOW(),
                 origin.deployed_at,
                 :git_helm_repository,
                 :git_helm_path
             FROM origin
             RETURNING manifest_id
     )
SELECT manifest_id FROM inserted;
