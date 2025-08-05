INSERT INTO vault_api_action_log (user_id_code,
                                  ip_address,
                                  action,
                                  secret_key,
                                  status_code,
                                  error_message,
                                  user_agent,
                                  first_name,
                                  last_name,
                                  client_name)
VALUES (:user_id_code,
        :ip_address,
        :action,
        :secret_key,
        :status_code,
        :error_message,
        :user_agent,
        :first_name,
        :last_name,
        (SELECT name
         FROM clients
         WHERE client_id = :client_id::uuid
            AND id IN (SELECT max (id) FROM clients GROUP BY client_id)
            AND deleted = FALSE)) RETURNING id, created_at;
