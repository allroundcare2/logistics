<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
        // the `slug` parameter is available because this file
        // is called [slug].svelte
        const { id } = page.query;
        return { id };
    }
</script>

<script lang="ts">
    import Nav from "../../components/Nav.svelte";
import Swal from "sweetalert2";
import { onMount } from "svelte";
import {goto} from '@sapper/app';
    import axios from "axios";
    import { checkForSession, getUrl } from "../../functions/clientAuth";
    const page = "Cancel the Order";
    let cancelVariable = '';
    export let id;
    let user: any = {};
    let win: any;
    let url = '';
    let loading = false;
    const cancelOrder =async ()=>{
        
       const swalResponse = await Swal.fire({
            icon: 'question',
            text:'Do you really want to cancel this order',
            title: 'cancel order',
            cancelButtonText: 'cancel order',
            confirmButtonText: 'confirm order',
            showCancelButton: true,
            confirmButtonColor: 'green'
        });

      
        if(swalResponse.isConfirmed){
            loading = true;
            win.iziToast.info({
            message: 'cancelling order',
            title: 'submitting...'
        });
        try {
            const orderResp = await axios.put(
                `${url}/drivers/decline_order?id=${id}`,
                {reason:cancelOrder},
                {
                    headers: {
                        Authorization: "Bearer " + user.token,
                    },
                }
            );

            if(orderResp){
                const swalResponse =  await Swal.fire({
                icon: 'success',
                text: `order cancelled successfully because ${cancelVariable} wait for admin approval`,
                title: 'success'
            });
            }
        
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "something went wrong when cancelling the trip",
                title: "oops!!!",
            });
        }
      
        
    } 
       
    }
    onMount(()=>{
        win = window;
        url = getUrl();
       const user = checkForSession(goto);
    })
</script>

<main>
    <div class="container">
        <Nav {page} />

        <div class="row">
            <div class="col">
                <div class="card card-body">
                    <div class="">
                        <span
                            style="color: green"
                            class="fa fa-exclamation-circle"
                        />
                        <span class="topic">Tip</span>
                    </div>
                    <p class="text">
                        1. You can only cancel based on difference in delivery
                        details
                    </p>
                    <p class="text">
                        2. Your account will be suspended for one day if you
                        cancel 5 orders in a day
                    </p>
                    <div />
                </div>
            </div>
        </div>
        <p class="topic">Why do you want to cancel this order?</p>
        <p class="bigger-text">
            Pickup location was offline
            <input
                bind:group={cancelVariable}
                value="offline"
                class="float-end"
                type="radio"
                name="reason"
                id=""
            />
        </p>
        <p class="bigger-text">
            Information provided was wrong
            <input
                bind:group={cancelVariable}
                value="wrong info"
                class="float-end"
                type="radio"
                name="reason"
                id=""
            />
        </p>
        <p class="bigger-text">
            Pickup customer was rude
            <input
                bind:group={cancelVariable}
                value="rude customer"
                class="float-end"
                type="radio"
                name="reason"
                id=""
            />
        </p>
        <p class="bigger-text">
            I have mechanical issues
            <input
                bind:group={cancelVariable}
                value="mechanical issues"
                class="float-end"
                type="radio"
                name="reason"
                id=""
            />
        </p>

        <div class="mt-5">
            {#if cancelVariable}
                <button on:click={cancelOrder} class="btn my-btn btn-success"
                    >confirm</button
                >
            {:else if loading}
                <button class="btn my-btn btn-success">confirming...</button>
            {:else}
                <button disabled class="btn my-btn btn-success">confirm</button>
            {/if}
        </div>
    </div>
</main>

<style>
    main {
        min-height: 100vh;
        font-family: "Mulish", sans-serif;
        background-color: whitesmoke;
    }
    .fa {
        font-size: 18px;
    }
    .topic {
        font-weight: 700;
        font-size: 17px;
        line-height: 18px;
        color: #030919;
    }
    .text {
        font-weight: 400;
        font-size: 13px;
        line-height: 18px;
        color: #555b6a;
    }
    .bigger-text {
        font-weight: 400;
        font-size: 15px;
        line-height: 32px;
        color: #555b6a;
    }
</style>
