INSERT INTO manifests (client_id, name, git_helm_branch, helm_values, git_helm_repository, git_helm_path)
VALUES (:client_id::uuid, :name, :git_helm_branch, :helm_values, :git_helm_repository, :git_helm_path)
RETURNING manifest_id;
