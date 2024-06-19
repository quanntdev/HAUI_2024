export async function NotificationSave(
  Repo: any,
  action: number,
  logNote: number,
  seen: number,
  user: number,
) {
  const newNotification: any = {
    action:action,
    logNote: logNote,
    seen: seen,
    user: user,
  };

  await Repo.save(newNotification);
}
