-- liquibase formatted sql
-- changeset turkeshintroduct:1842412057

ALTER TABLE deployments
    ADD COLUMN deleted BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN deployment_id uuid DEFAULT uuid_generate_v4() NOT NULL;
