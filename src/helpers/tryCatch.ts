export async function tryCatch<ReturnType>(
  callback: () => Promise<ReturnType>,
  setLoading?: (value: boolean) => void
): Promise<[ReturnType | null, unknown]> {
  if (setLoading) {
    setLoading(true);
  }
  try {
    const result = await callback();
    return [result, null];
  } catch (err) {
    return [null, err];
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
}
