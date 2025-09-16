WITH credentials AS (SELECT split_part(
                                    convert_from(
                                            decode(:authorization::text, 'base64'),
                                            'utf8'
                                    ),
                                    ':', 1
                            ) AS api_key,
                            split_part(
                                    convert_from(
                                            decode(:authorization, 'base64'),
                                            'utf8'
                                    ),
                                    ':', 2
                            ) AS api_secret)
SELECT EXISTS (SELECT 1
               FROM api_clients
               WHERE api_key = (SELECT api_key FROM credentials)
                 AND api_secret = (SELECT api_secret FROM credentials)
                 AND is_enabled = true) ::text AS is_valid;
