INSERT INTO clients (client_id,
                     name,
                     kubernetes_cluster_address,
                     kubernetes_cluster_namespace,
                     argo_app_deployment_name,
                     updated_at,
                     created_at,
                     part_of_network,
                     authentication_certificate)
SELECT client_id,
       :name,
       :kubernetes_cluster_address,
       :kubernetes_cluster_namespace,
       :argo_app_deployment_name,
       now(),
       created_at,
       :part_of_network,
       authentication_certificate
FROM clients
WHERE client_id = :client_id::uuid
  AND id = (SELECT max (id) FROM clients WHERE client_id = :client_id::uuid);
