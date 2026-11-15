export default function UpcomingReminders({ reminders }) {
  const now = new Date();
  const upcomingReminders = reminders
    .filter((reminder) => {
      const status = reminder.status?.toLowerCase();
      return (
        new Date(reminder.scheduledAt) >= now &&
        status !== "completed" &&
        status !== "cancelled"
      );
    })
    .slice(0, 3);

  return (
    <div className="rounded-3xl border border-[#F0DDD5] bg-white/95 p-6 shadow-[0_4px_25px_rgba(84,43,53,0.04)] backdrop-blur-sm lg:p-8">
      <div className="border-b border-[#F7EDE8] pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#A83D55]">
          Your schedule
        </span>
        <h2 className="font-serif text-2xl font-semibold text-[#542B35]">
          Upcoming Reminders
        </h2>
      </div>

      {upcomingReminders.length === 0 ? (
        <p className="pt-5 text-sm text-[#806B68]">
          You don’t have any upcoming reminders.
        </p>
      ) : (
        <ul className="divide-y divide-[#F7EDE8]">
          {upcomingReminders.map((reminder) => (
            <li
              key={reminder.id}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="font-medium capitalize text-[#542B35]">
                {reminder.reminderType.replaceAll("_", " ")}
              </span>
              <time
                dateTime={reminder.scheduledAt}
                className="text-xs text-[#806B68]"
              >
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(reminder.scheduledAt))}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
