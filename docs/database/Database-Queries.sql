INSERT INTO cycles (user_id, start_date, end_date, status)
VALUES ($1, $2, NULL, 'active')
RETURNING id, user_id, start_date, end_date, status;

UPDATE cycles
SET end_date = $2,
    status = CASE WHEN $2 IS NULL THEN 'active' ELSE 'completed' END
WHERE id = $1 AND user_id = $3
RETURNING id, start_date, end_date, status;

DELETE FROM symptom_logs
WHERE id = $1 AND user_id = $2
RETURNING id;

SELECT symptom_logs.id,
       symptom_logs.date,
       symptoms.name,
       symptoms.category,
       symptom_log_items.severity
FROM symptom_logs
INNER JOIN symptom_log_items
    ON symptom_log_items.symptom_log_id = symptom_logs.id
INNER JOIN symptoms
    ON symptoms.id = symptom_log_items.symptom_id
WHERE symptom_logs.user_id = $1
ORDER BY symptom_logs.date DESC;

SELECT users.id,
       users.name,
       user_preferences.cycle_length,
       user_preferences.period_length
FROM users
LEFT JOIN user_preferences
    ON user_preferences.user_id = users.id
WHERE users.id = $1;

SELECT symptoms.name,
       symptoms.category,
       COUNT(symptom_log_items.id) AS occurrences
FROM symptom_logs
INNER JOIN symptom_log_items
    ON symptom_log_items.symptom_log_id = symptom_logs.id
INNER JOIN symptoms
    ON symptoms.id = symptom_log_items.symptom_id
WHERE symptom_logs.user_id = $1
GROUP BY symptoms.id, symptoms.name, symptoms.category
HAVING COUNT(symptom_log_items.id) >= $2
ORDER BY occurrences DESC, symptoms.name;

SELECT cycles.id, cycles.start_date
FROM cycles
WHERE cycles.user_id = $1
  AND (
      SELECT COUNT(*)
      FROM period_logs
      WHERE period_logs.cycle_id = cycles.id
  ) >= $2
ORDER BY cycles.start_date DESC;

WITH ordered_cycles AS (
    SELECT start_date,
           LAG(start_date) OVER (ORDER BY start_date) AS previous_start
    FROM cycles
    WHERE user_id = $1
),
cycle_intervals AS (
    SELECT start_date - previous_start AS days
    FROM ordered_cycles
    WHERE previous_start IS NOT NULL
)
SELECT COUNT(*) AS interval_count,
       AVG(days) AS average_cycle_length
FROM cycle_intervals
WHERE days BETWEEN 1 AND 120;
