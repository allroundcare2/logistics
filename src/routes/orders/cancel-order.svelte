<script lang="ts">
    import Nav from "../../components/Nav.svelte";
import Swal from "sweetalert2";
import { onMount } from "svelte";
import {goto} from '@sapper/app';
    const page = "Cancel the Order";
    let cancelVariable = '';
    let win: any;
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
        setTimeout(async ()=>{
        const swalResponse =  await Swal.fire({
                icon: 'success',
                text: `order cancelled successfully because ${cancelVariable}`,
                title: 'success'
            });
            if(swalResponse) goto('orders')
        },4000)
        console.log(cancelVariable);

        }
       
    }
    onMount(()=>{
        win = window;
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
            <input bind:group="{cancelVariable}" value="offline" class="float-end" type="radio" name="reason" id="" />
        </p>
        <p class="bigger-text">
            Information provided was wrong
            <input bind:group="{cancelVariable}" value="wrong info" class="float-end" type="radio" name="reason" id="" />
        </p>
        <p class="bigger-text">
            Pickup customer was rude
            <input bind:group="{cancelVariable}" value="rude customer" class="float-end" type="radio" name="reason" id="" />
        </p>
        <p class="bigger-text">
            I have mechanical issues
            <input bind:group="{cancelVariable}" value="mechanical issues" class="float-end" type="radio" name="reason" id="" />
        </p>

        <div class="mt-5">
          {#if cancelVariable}
          <button on:click="{cancelOrder}" class="btn my-btn btn-success">confirm</button>
          {:else if  loading}
          <button class="btn my-btn btn-success">confirming...</button>
          {:else}
          <button disabled  class="btn my-btn btn-success">confirm</button>
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
