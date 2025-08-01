INSERT INTO clients (client_id,
                     name,
                     kubernetes_cluster_address,
                     kubernetes_cluster_namespace,
                     argo_app_deployment_name,
                     authentication_certificate,
                     updated_at,
                     created_at,
                     part_of_network)
SELECT client_id,
       name,
       kubernetes_cluster_address,
       kubernetes_cluster_namespace,
       argo_app_deployment_name,
       :authentication_certificate,
       now(),
       created_at,
       part_of_network
FROM clients
WHERE client_id = :client_id::uuid
  AND id = (SELECT max (id) FROM clients WHERE client_id = :client_id::uuid);
