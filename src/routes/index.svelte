<script lang="ts">
    import Sidebar from "../components/Sidebar.svelte";
    import { onMount } from "svelte";
    import { checkForSession } from "../functions/clientAuth";
    import { goto } from "@sapper/app";
    let session_user: any = {};
    onMount(() => {
         session_user = checkForSession(goto);
         console.log(session_user);
    });
</script>
{#if session_user}
    
<main>
    <div class="container">
        <nav class="row " style="background-color: transparent">
            <div class="col-3">
                <Sidebar />
            </div>
            <div class="col-9">
                <img src='{session_user.profile_pics || 'images/indomie.jpg'}' alt="profile pics" class="pp float-end" />
            </div>
        </nav>
    <section class="row" id="">
        <div class="col-12 col-sm-6 col-md-3">
            <div class="card card-body bg-primary text-white mb-1 mr-1 mt-0 mb-0">
                <div class="row">
                    <div class="col-3">

                    </div>
                    <div class="col-9">
                        <p class="main-txt mb-0"><strong>₦3,000</strong></p>
                        <p class="mb-0"><small>wallet balance</small></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
            <div class="card card-body bg-secondary text-white mb-1 mr-1 mt-0 mb-0">
                <div class="row">
                    <div class="col-3">

                    </div>
                    <div class="col-9">
                        <p class="main-txt mb-0"><strong>1</strong></p>
                        <p class="mb-0"><small>Total Orders</small></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
            <div class="card card-body bg-danger text-white mb-1 mr-1 mt-0 mb-0">
                <div class="row">
                    <div class="col-3">

                    </div>
                    <div class="col-9">
                        <p class="main-txt mb-0"><strong>0</strong></p>
                        <p class="mb-0"><small>Cancelled Order</small></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
            <div class="card card-body bg-primary text-white mb-1 mr-1 mt-0 mb-0">
                <div class="row">
                    <div class="col-3">

                    </div>
                    <div class="col-9">
                        <p class="main-txt mb-0"><strong>₦3,000</strong></p>
                        <p class="mb-0"><small>wallet balance</small></p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </div>
</main>
{:else}
     loading
{/if}

<style>
    main {
        font-family: "Mulish", sans-serif;
        background-color: whitesmoke;
        min-height: 100vh;
    }
    .main-txt{
        font-size: 20px;
        font-weight: 600;
    }
    .pp{
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
</style>
