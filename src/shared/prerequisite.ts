export async function preRequisite(
  arr: { courseId: string; isDeleted: boolean }[],
  // eslint-disable-next-line no-unused-vars
  course: (obj: { courseId: string; isDeleted: boolean }) => void
) {
  for (let i = 0; i < arr.length; i++) {
    await course(arr[i]);
  }
}
