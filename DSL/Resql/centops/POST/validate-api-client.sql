SELECT EXISTS (SELECT 1
               FROM api_clients
               WHERE api_key = :api_key
                 and api_secret = :api_secret
                 and is_enabled = true) AS is_valid;
