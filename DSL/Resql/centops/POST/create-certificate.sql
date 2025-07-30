WITH existing AS (SELECT certificate_id
                  FROM certificates
                  WHERE client_id = :client_id::uuid
                    AND revoked = false
                    AND deleted = false
                  LIMIT 1),
     revoked AS (
         UPDATE certificates
             SET revoked = true
             WHERE certificate_id = (SELECT certificate_id FROM existing)),
     inserted AS (
         INSERT INTO certificates (client_id, public_key)
             VALUES (:client_id::uuid, :public_key)
             RETURNING certificate_id)
SELECT certificate_id
FROM inserted;
