
<script lang="ts">
import { onMount } from "svelte";
import {goto} from '@sapper/app';
    let bsOffcanvas: any;
    let win: any;
    const open =()=>{
        bsOffcanvas.show();
    }

    const nav =(screen: string)=>{
      goto(screen)
    }
    onMount(()=>{
        win = window;
        console.log(win);
        const myOffcanvas = document.getElementById('sidebar')
         bsOffcanvas = new win.bootstrap.Offcanvas(myOffcanvas);
    })
</script>


<button on:click="{open}" class="btn "> <span class="fa fa-bars"></span> </button>
<div class="offcanvas offcanvas-start" tabindex="-1" id="sidebar" aria-labelledby="sidebarLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="sidebarLabel">ARC</h5>
      <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div>
        <p>
          <small>Balance: </small> <span class="balance">₦20,000.00</span>
        </p>
      </div>
    
     <div class="container">
      <div class="row mb-3">
        <div class="col-2"><span class="fa fa-home"></span></div>
        <div class="col-8"><strong>Home</strong></div>
      </div>
      <div class="row mb-3">
        <div class="col-2"><span class="fa fa-credit-card"></span></div>
        <div class="col-8"><strong>Earning</strong></div>
      </div>
      <div on:click="{()=>{nav('/orders')}}" class="row mb-3">
        <div class="col-2"><span class="fa fa-calendar-o"></span></div>
        <div class="col-8"><strong>Orders</strong></div>
      </div>
      <div class="row mb-3" on:click="{()=>{nav('/accounts')}}">
        <div class="col-2"><span class="fa fa-cog"></span></div>
        <div class="col-8"><strong>Settings</strong></div>
      </div>
      <div class="row mb-3">
        <div class="col-2"><span class="fa fa-phone"></span></div>
        <div class="col-8"><strong>Support</strong></div>
      </div>
      <div class="row mb-3">
        <div class="col-2"><span class="fa fa-exclamation"></span></div>
        <div class="col-8"><strong>About</strong></div>
      </div>
      <div class="row">
        <div class="col-2"><span class="fa fa-sign-out"></span></div>
        <div class="col-8"><strong>Logout</strong></div>
      </div>
      
      
     </div>
   
    </div>
  </div>

  <style>
    .offcanvas {
        background-color: #27ad60;
        color: white
    }
    .btn {
        width: 40px;
        height: 40px;
        background-color: white;
        border-radius: 50%;
    }
    .balance {
      font-weight: 400;
      font-size: large;
    }
  </style>