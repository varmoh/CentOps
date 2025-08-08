WITH decoded_data AS (SELECT CASE
                                 WHEN :authorization IS NULL OR :authorization = '' THEN NULL
                                 WHEN length(:authorization) % 4 != 0 THEN NULL
                                 WHEN :authorization !~ '^[A-Za-z0-9+/]*={0,2}$' THEN NULL
                                 ELSE
                                     convert_from(decode(:authorization, 'base64'), 'latin1')
                                 END AS raw_data),
     valid_utf8_check AS (SELECT raw_data,
                                 CASE
                                     WHEN raw_data IS NULL THEN NULL
                                     WHEN convert(raw_data::bytea, 'UTF8', 'LATIN1') IS NOT NULL THEN raw_data
                                     ELSE NULL
                                     END AS safe_utf8_data
                          FROM decoded_data),
     credentials AS (SELECT CASE
                                WHEN safe_utf8_data IS NOT NULL
                                    AND safe_utf8_data ~ '^[^:]+:[^:]+$' THEN split_part(safe_utf8_data, ':', 1)
                                ELSE NULL
                                END AS api_key,
                            CASE
                                WHEN safe_utf8_data IS NOT NULL
                                    AND safe_utf8_data ~ '^[^:]+:[^:]+$' THEN split_part(safe_utf8_data, ':', 2)
                                ELSE NULL
                                END AS api_secret
                     FROM valid_utf8_check)
SELECT COALESCE(
               (SELECT EXISTS (SELECT 1
                               FROM api_clients
                               WHERE api_key = c.api_key
                                 AND api_secret = c.api_secret
                                 AND is_enabled = true)
                FROM credentials c
                WHERE c.api_key IS NOT NULL),
               false
       ) ::text AS is_valid;
