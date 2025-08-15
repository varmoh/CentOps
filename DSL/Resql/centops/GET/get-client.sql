SELECT client_id,
       name,
       kubernetes_cluster_id,
       kubernetes_cluster_namespace,
       argo_app_deployment_name,
       authentication_certificate,
       created_at,
       updated_at,
       part_of_network
FROM clients
WHERE client_id = :client_id::uuid
  AND id = (SELECT max(id) FROM clients WHERE client_id = :client_id::uuid)
  AND deleted = false;
