INSERT INTO certificates (certificate_id, client_id, public_key, revoked, deleted)
SELECT certificate_id,
       client_id,
       public_key,
       TRUE,
       TRUE
FROM certificates
WHERE certificate_id = :certificate_id::uuid
  AND client_id = :client_id::uuid
