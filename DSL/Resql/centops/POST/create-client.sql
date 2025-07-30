INSERT INTO clients (name,
                     kubernetes_cluster_address,
                     kubernetes_cluster_namespace,
                     argo_app_deployment_name,
                     part_of_network)
VALUES (:name,
        :kubernetes_cluster_address,
        :kubernetes_cluster_namespace,
        :argo_app_deployment_name,
        :part_of_network)
