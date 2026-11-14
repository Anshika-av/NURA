CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_preferences" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "cycle_length" SMALLINT NOT NULL,
    "period_length" SMALLINT NOT NULL,
    "notification_settings" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cycles" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "cycles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "period_logs" (
    "id" BIGSERIAL NOT NULL,
    "cycle_id" BIGINT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "flow_intensity" VARCHAR(20) NOT NULL,

    CONSTRAINT "period_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "symptom_logs" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "date" DATE NOT NULL,
    "mood" VARCHAR(50),
    "notes" TEXT,

    CONSTRAINT "symptom_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "symptoms" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,

    CONSTRAINT "symptoms_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "symptom_log_items" (
    "id" BIGSERIAL NOT NULL,
    "symptom_log_id" BIGINT NOT NULL,
    "symptom_id" BIGINT NOT NULL,
    "severity" VARCHAR(20) NOT NULL,

    CONSTRAINT "symptom_log_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reminders" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "reminder_type" VARCHAR(50) NOT NULL,
    "scheduled_at" TIMESTAMPTZ(6) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "health_reports" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "report_type" VARCHAR(50) NOT NULL,
    "generated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "health_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

CREATE INDEX "idx_cycles_user_id" ON "cycles"("user_id");

CREATE INDEX "idx_period_logs_cycle_id" ON "period_logs"("cycle_id");

CREATE INDEX "idx_symptom_logs_user_date" ON "symptom_logs"("user_id", "date");

CREATE UNIQUE INDEX "uq_symptom_name_category" ON "symptoms"("name", "category");

CREATE INDEX "idx_symptom_items_symptom_id" ON "symptom_log_items"("symptom_id");

CREATE UNIQUE INDEX "uq_log_symptom" ON "symptom_log_items"("symptom_log_id", "symptom_id");

CREATE INDEX "idx_reminders_user_scheduled" ON "reminders"("user_id", "scheduled_at");

CREATE INDEX "idx_health_reports_user_id" ON "health_reports"("user_id");

ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cycles" ADD CONSTRAINT "cycles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "period_logs" ADD CONSTRAINT "period_logs_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "symptom_logs" ADD CONSTRAINT "symptom_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "symptom_log_items" ADD CONSTRAINT "symptom_log_items_symptom_log_id_fkey" FOREIGN KEY ("symptom_log_id") REFERENCES "symptom_logs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "symptom_log_items" ADD CONSTRAINT "symptom_log_items_symptom_id_fkey" FOREIGN KEY ("symptom_id") REFERENCES "symptoms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "health_reports" ADD CONSTRAINT "health_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_preferences" ADD CONSTRAINT "chk_cycle_length" CHECK ("cycle_length" BETWEEN 1 AND 120);
ALTER TABLE "user_preferences" ADD CONSTRAINT "chk_period_length" CHECK ("period_length" BETWEEN 1 AND 30);
ALTER TABLE "cycles" ADD CONSTRAINT "chk_cycle_dates" CHECK ("end_date" IS NULL OR "end_date" >= "start_date");
ALTER TABLE "cycles" ADD CONSTRAINT "chk_cycle_status" CHECK ("status" IN ('active', 'completed'));
ALTER TABLE "period_logs" ADD CONSTRAINT "chk_period_dates" CHECK ("end_date" IS NULL OR "end_date" >= "start_date");
ALTER TABLE "period_logs" ADD CONSTRAINT "chk_flow_intensity" CHECK ("flow_intensity" IN ('spotting', 'light', 'medium', 'heavy'));
ALTER TABLE "symptom_log_items" ADD CONSTRAINT "chk_symptom_severity" CHECK ("severity" IN ('mild', 'moderate', 'severe'));
ALTER TABLE "reminders" ADD CONSTRAINT "chk_reminder_status" CHECK ("status" IN ('pending', 'sent', 'completed', 'cancelled'));
