-- Q18 Phase 4: GIN index on WebhookEvent.payload for faster idempotency lookups
-- Speeds queries that search JSONB payload fields during webhook deduplication
CREATE INDEX CONCURRENTLY IF NOT EXISTS "WebhookEvent_payload_gin_idx"
  ON "WebhookEvent" USING GIN ("payload");
