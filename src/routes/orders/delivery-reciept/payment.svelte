<script context="module">
	// the (optional) preload function takes a
	// `{ path, params, query }` object and turns it into
	// the data we need to render the page
	export async function preload(page, session) {
		// the `slug` parameter is available because this file
		// is called [slug].svelte
		const { id } = page.query;
;

		return { id };
	}
</script>


<script lang="ts">
    import axios from "axios";
    import { onMount } from "svelte";
    import {goto} from '@sapper/app';
    import { checkForSession, getUrl } from "../../../functions/clientAuth";
    import { handleNotification } from "../../../functions/clientNot";
    import type { Iuser } from "../../../Model/accounts";
    import Swal from "sweetalert2";
    export let id;
    let files;
    let amount;
    let loading = false;
    let url = '';
    let name;
    let user: Iuser = {};
    let filename = '';
    const selectFile = () => {
        document.getElementById('files').click();
    };
const upload =async ()=>{
   if(!files) return handleNotification('you have to upload a picture',
   window, 'error', 'Error');
   if(!amount) return handleNotification('you have enter an amount',
   window, 'error', 'Error');
   try {
    loading = true;
    let form = new FormData();
    amount = Number(amount);
    let body = {
        amount, name, orderId: id
    }
    console.log(body);
    form.append('img', files[0]);
    form.append('body', JSON.stringify(body));
  
  let resp = await axios.post(`${url}/drivers/submit-reciept`, form, {
                    headers: {
                        Authorization: "Bearer " + user.token,
                    },
                });
        if(resp){
            loading = false;
        const swalResp = await Swal.fire({
                title: 'Success!!!',
                text: 'You will be notified as soon as your request is being confirmed',
                icon: 'success',
                confirmButtonText: 'Dashboard'
            });
            if(swalResp){
                goto('/orders');
            }
        }
   } catch (error) {
    loading = false;
    console.log(error);
    handleNotification('failed to upload reciept, try again', window,'error','oops!!!');
   }
}
const readFile =()=>{
    console.log('my test',files);
    if(files){
        filename = files[0].name;
    }
}
    onMount(() => {
        url = getUrl();
        user = checkForSession(goto);
    });
</script>

<main>
    <div class="container mb-2">
        <h2 class="strong mt-5 text-center">Confirm Payment</h2>
        <p class="comment mt-3 mb-3">Upload the payment receipt image below</p>

        <div class="card card-body p-3">
            <p class="title">Receipt Information</p>

            <form class="mt-4 mb-4">
                <div class="mb-2">
                    <input bind:value={name} type="text" placeholder="Name" />
                </div>
                <div class="mt-4">
                    <input bind:value={amount} type="text" placeholder="amount" />
                </div>

                <div class="mt-4 d-grid gap-2">
                    <small>{filename}</small>
                    <button on:click|preventDefault="{selectFile}" on:blur={readFile} class="upload btn ">upload a file</button>
                    <input accept="image/*, application/pdf"  on:change="{readFile}" id="files" bind:files type="file" />
                </div>
                <div class="mt-5">
                    <button type="submit" on:click|preventDefault="{upload}" disabled={loading} class="upload btn float-end">
                    {#if loading}
                    Submiting Form...
                    {:else}
                    Submit Form
                    {/if}
                    </button>
                </div>
            </form>
        </div>
    </div>
</main>

<style>
    .upload {
      
        height: 45px;
        box-sizing: border-box;
        border: 1px solid #27ad60;
        border-radius: 5px;
    }
    input[type="file"] {
        width: 0;
        height: 0;
    }
    input[type="text"] {
        width: 100%;
        height: 45px;
        padding-left: 10px;
        padding-right: 10px;
        background: #f7f7f7;
        border: 0.5px solid #8b8b8b;
        border-radius: 5px;
    }
    .title {
        font-family: "Mulish";
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 25px;
        color: #535151;
    }
    .strong {
        font-family: "Mulish";
        font-style: normal;
        font-weight: 800;
        font-size: 24px;
        line-height: 30px;

        color: #2fa94e;
    }
    .comment {
        font-family: "Mulish";
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 15px;

        text-align: center;

        color: #555b6a;
    }
</style>
