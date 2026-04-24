-- V1__drop_subscriptions.sql
-- Removes the subscription model. Spire uses one-time purchases
-- per PRODUCT.md. This migration is documented intent; it will
-- be applied automatically once Flyway is introduced. Until
-- then, schema.sql is the source of truth and has been updated
-- in lockstep.
--
-- For any environment that already has the subscriptions table
-- in place, running this SQL will remove it and any FKs pointing
-- into it.

DROP TABLE IF EXISTS subscriptions CASCADE;
