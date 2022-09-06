<script lang="ts">
    import Nav from "../../components/Nav.svelte";
import Swal from "sweetalert2";
import { onMount } from "svelte";
import {goto} from '@sapper/app';
    const page = "Complete Order";
    let completeVariable = '';
    let win: any;
    let loading = false;
    const confirmOrder =async ()=>{
        
       const swalResponse = await Swal.fire({
            icon: 'question',
            text:'You are about to end this order',
            title: 'complete order',
            cancelButtonText: 'cancel ',
            confirmButtonText: 'complete order',
            showCancelButton: true,
            confirmButtonColor: 'green'
        });

      
        if(swalResponse.isConfirmed){
            loading = true;
            win.iziToast.info({
            message: 'completing order',
            title: 'submitting...'
        });
        setTimeout(async ()=>{
        const swalResponse =  await Swal.fire({
                icon: 'success',
                text: `order cancelled successfully because ${completeVariable}`,
                title: 'success'
            });
            if(swalResponse) goto('orders')
        },4000)
        console.log(completeVariable);

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
                  <p>Mark order is an important aspects of the app, all orders must be marked to validate a safe delivery</p>
                    <div />
                </div>
            </div>
        </div>
        <p class="bigger-text">
            Delivered directly to customer
            <input bind:group="{completeVariable}" value="delivered directly to customer" class="float-end" type="radio" name="reason" id="" />
        </p>
        <p class="bigger-text">
            Customer directed on doorpost
            <input bind:group="{completeVariable}" value="Customer directed on doorpost" class="float-end" type="radio" name="reason" id="" />
        </p>
        <p class="bigger-text">
            Delivered to third party on customer notice
            <input bind:group="{completeVariable}" value="Delivered to third party on customer notice" class="float-end" type="radio" name="reason" id="" />
        </p>
        <p class="bigger-text">
            Customer was offline
            <input bind:group="{completeVariable}" value="Customer was offline" class="float-end" type="radio" name="reason" id="" />
        </p>

        <div class="mt-5">
          {#if completeVariable}
          <button on:click="{confirmOrder}" class="btn my-btn btn-success">confirm</button>
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
