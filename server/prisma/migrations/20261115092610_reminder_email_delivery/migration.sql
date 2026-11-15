ALTER TABLE "reminders"
ADD COLUMN "delivery_status" VARCHAR(20) NOT NULL DEFAULT 'queued',
ADD COLUMN "delivery_attempts" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN "next_attempt_at" TIMESTAMPTZ(6),
ADD COLUMN "processing_started_at" TIMESTAMPTZ(6),
ADD COLUMN "last_delivery_error" VARCHAR(100);

UPDATE "reminders"
SET "delivery_status" = CASE
    WHEN "status" = 'pending' AND "scheduled_at" > CURRENT_TIMESTAMP THEN 'queued'
    WHEN "status" = 'pending' THEN 'failed'
    WHEN "status" = 'sent' THEN 'sent'
    ELSE 'cancelled'
END,
"last_delivery_error" = CASE
    WHEN "status" = 'pending' AND "scheduled_at" <= CURRENT_TIMESTAMP
        THEN 'REMINDER_EXPIRED_BEFORE_DELIVERY'
    ELSE NULL
END;

ALTER TABLE "reminders"
ADD CONSTRAINT "chk_reminder_delivery_status"
CHECK ("delivery_status" IN ('queued', 'processing', 'sent', 'failed', 'cancelled'));

ALTER TABLE "reminders"
ADD CONSTRAINT "chk_reminder_delivery_attempts"
CHECK ("delivery_attempts" >= 0);

CREATE INDEX "idx_reminders_delivery_due"
ON "reminders"("status", "delivery_status", "scheduled_at", "next_attempt_at");
