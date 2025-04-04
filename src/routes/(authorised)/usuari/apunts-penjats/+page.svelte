<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import Upload from 'lucide-svelte/icons/upload';
	import Edit from 'lucide-svelte/icons/pencil';
	import Trash from 'lucide-svelte/icons/trash';
	import { toast } from 'svelte-sonner';

	import { invalidate } from '$app/navigation';
	import { pb, getFileUrl } from '$lib/pocketbase';
	import { formatDate } from '$lib/utils';
	import type { Note } from '$lib/types';
	import posthog from 'posthog-js';

	let { data } = $props();

	let noteToDelete = $state(null) as Note | null;
	let dialogOpen = $state(false);

	function confirmDelete(event: Event, id: string) {
		event.preventDefault();
		noteToDelete = data.notes.find((note) => note.id === id) || null;
		dialogOpen = true;
	}

	async function deleteNote() {
		try {
			await pb.collection('notes').delete(noteToDelete.id);
			posthog.capture('delete_note', {
				title: noteToDelete.title,
				subject: noteToDelete.subject,
				topic: noteToDelete.topic,
				type: noteToDelete.type,
				course: noteToDelete.course
			});
			invalidate('app:user');
			toast.success('Apunts eliminats correctament');
		} catch (error) {
			toast.error('Error al eliminar els apunts');
		} finally {
			dialogOpen = false;
		}
	}
</script>

<div class="mt-4">
	{#if data.notes.length > 0}
		<Table.Root>
			<Table.Header>
				<Table.Row class="hover:bg-transparent">
					<Table.Head>Títol</Table.Head>
					<Table.Head>Assignatura</Table.Head>
					<Table.Head class="hidden md:table-cell">Penjat</Table.Head>
					<Table.Head class="max-w-20 lg:max-w-16"></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.notes as note (note.id)}
					<a href={getFileUrl(note)} target="_blank" class="contents">
						<Table.Row>
							<Table.Cell class="font-semibold">{note.title}</Table.Cell>
							<Table.Cell>{note.expand.subject.acronym}</Table.Cell>
							<Table.Cell class="hidden md:table-cell">{formatDate(note.created)}</Table.Cell>
							<Table.Cell class="max-w-20 lg:max-w-16 flex space-x-2">
								<Button
									variant="default"
									href={`/usuari/apunts-penjats/${note.id}`}
									class="h-7 w-8"
								>
									<Edit class="h-4 w-4" />
								</Button>
								<Button
									variant="destructive"
									onclick={(e) => confirmDelete(e, note.id)}
									class="h-7 w-8"
								>
									<Trash class="h-4 w-4" />
								</Button>
							</Table.Cell>
						</Table.Row>
					</a>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<div class="text-center mt-16">
			<p class="mb-8 text-muted-foreground">Encara no has compartit cap apunt.</p>
			<Button href="/usuari/penja-apunts">
				<Upload class="h-4 w-4 mr-2" />
				Penja apunts
			</Button>
		</div>
	{/if}
</div>

<AlertDialog.Root bind:open={dialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>
				{#if noteToDelete}
					Eliminar "{noteToDelete.title}"?
				{:else}
					Eliminar apunts?
				{/if}
			</AlertDialog.Title>
			<AlertDialog.Description>
				Aquesta acció és irreversible. Els apunts seran eliminats permanentment.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel·lar</AlertDialog.Cancel>
			<Button variant="destructive" onclick={deleteNote}>Eliminar</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
