<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.ts";
  import { Label } from "$lib/components/ui/label/index.ts";
  import { Input } from "$lib/components/ui/input/index.ts";
  import { Button } from "$lib/components/ui/button/index.ts";
  import { Separator } from "$lib/components/ui/separator";
  import { LoaderCircle } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { pb } from "$lib/pocketbase.ts";
  
  let email = $state("");
  let password = $state("");
  let formError = $state(false);
  let formLoading = $state(false);

  async function login() {
    formError = false;
    formLoading = true;
    try {
      const response = await pb.collection("users").authWithPassword(email, password);
      if (pb.authStore.isValid) {
        goto("/");
      }
    } catch (error) {
      formError = true;
    } finally {
      formLoading = false;
    }
  }

  async function loginWithGoogle() {
    try {
      const response = await pb.collection('users').authWithOAuth2({ provider: 'google' });
      if (pb.authStore.isValid) {
        goto("/");
      }
    } catch (error) {}
  }
</script>

<svelte:head>
  <title>Inicia Sessió - Apunts Dades</title>
</svelte:head>

<div class="flex items-center justify-center h-screen">
  <Card.Root class="max-w-sm mx-auto border-0 shadow-none sm:border sm:shadow-sm">
    <Card.Header>
      <Card.Title class="text-2xl">Inicia Sessió</Card.Title>
      <Card.Description>Introdueix el teu correu electrònic i contrasenya per iniciar sessió al teu compte.</Card.Description>
    </Card.Header>
    <Card.Content>
      <form class="grid gap-4" onsubmit={login}>
        <div class="grid gap-2">
          <Label for="email">Correu electrònic</Label>
          <Input id="email" type="email" autocomplete="email" placeholder="alumne@estudiantat.upc.edu" bind:value={email} required />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Contrasenya</Label>
            <a href="/recupera-contrasenya" class="inline-block ml-auto text-sm underline">
              Has oblidat la contrasenya?
            </a>
          </div>
          <Input id="password" type="password" autocomplete="password" required bind:value={password} />
        </div>
        {#if formError}
          <span class="text-sm text-red-500">Error al iniciar sessió. Verifica les teves credencials.</span>
        {/if}
        <Button type="submit" class="w-full" disabled={formLoading}>
          {#if formLoading}
            <LoaderCircle class="h-5 animate-spin" />
          {:else}
            Inicia sessió
          {/if}
        </Button>
      </form>
      <Separator class="my-5" />
      <Button variant="outline" class="w-full space-x-1.5" onclick={loginWithGoogle}>
        <img src="/icons/google.svg" alt="Google Logo">
        <span>Inicia sessió amb Google</span>
      </Button>
      <div class="mt-4 text-sm text-center">
        No tens compte?
        <a href="/crea-compte" class="underline">Registra't</a>
      </div>
    </Card.Content>
  </Card.Root>
</div>