import { pb } from "$lib/pocketbase.ts";

export async function load({ params, parent }) {
  const { subject_id } = params;

  // filter subjects by subject_id
  const { subjects } = await parent();
  const subject = subjects.find(s => s.id === subject_id);

  const notes = await pb.collection('notes').getFullList({
      filter: `subject = "${subject_id}"`
  });

  return { 
    subject,
    notes,
    title: subject.acronym
  };
}