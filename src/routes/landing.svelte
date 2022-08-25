<script>
    import {goto} from '@sapper/app';
    const gotoNav = (nav)=>{
       goto(nav);
    }
</script>


<svelte:head>
    <title>ARC: logistics page</title>
</svelte:head>

<div class="main container">
    <div class="header pt-2 mb-5">
        <h2 class="text-center">ARC</h2>
    </div>
    <div class="text-center mt-5 mb-5">
        <img style="margin:auto 0" src="svg/bike.svg" alt="" />
    </div>
    <div class="text-center mt-5">
        <p class="h2">Earn <span> Quick</span> Money</p>
        <p>
            Earn money with us regularly as you take your time to deliver our
            product
        </p>
    </div>
    <div class="fixed-bottom text-center mb-5">
        
        <button on:click="{()=>{gotoNav('register/step1')}}" class="button outline mr-2">Register</button>
        <button on:click="{()=>{gotoNav('/login')}}"  class="button but ml-2">Login</button>
    </div>
</div>

<style>
    .main {
        font-family: "Mulish", sans-serif;
        background-color: whitesmoke;
        min-height: 100vh;
    }
    img {
        width: 212px;
        height: 200px;
    }
    .but {
        background-color: #27ad60;
        color: white;
        border-radius: 6px;
        width: 154px;
        height: 45px;
        font-size: 14px;
    }
    .outline {
        border: #27ad60 2px solid;
        border-radius: 6px;
        width: 154px;
        height: 45px;
        font-size: 14px;
        color:#555B6A
    }
    h2 {
        color: #27ad60;
        font-family: "Mulish", sans-serif;
        font-weight: 800;
    }
    .h2 {
        color: #555B6A;
        font-family: "Mulish", sans-serif;
        font-weight: 800;
    }
    span {
        color: #27ad60;
    }
</style>
