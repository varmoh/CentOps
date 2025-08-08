-- liquibase formatted sql
-- changeset turkeshintroduct:1835054286

CREATE TABLE api_clients
(
    id         SERIAL PRIMARY KEY,
    api_key    TEXT      NOT NULL,
    api_secret TEXT      NOT NULL,
    is_enabled BOOLEAN   NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP
);

CREATE INDEX idx_api_clients_api_key ON api_clients (api_key);
CREATE INDEX idx_api_clients_is_enabled ON api_clients (is_enabled);
