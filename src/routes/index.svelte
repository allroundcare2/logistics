<script lang="ts">
    import Sidebar from "../components/Sidebar.svelte";
    import { onMount } from "svelte";
    import { checkForSession, getUrl } from "../functions/clientAuth";
    import { goto } from "@sapper/app";
    import { handleNotification } from "../functions/clientNot";
    import axios from "axios";
    let session_user: any = {};
    let dashboard = {wallet: 0.00, totalOrders: 0};
    let url = '';
    onMount(async () => {
        url = getUrl();
         session_user = checkForSession(goto);
         console.log(session_user);
         handleNotification('loading dashboard details', window,'info', 'loading...');
      try {
        const result = await axios.get(url + '/drivers/dashboard', {
                        headers: {
                            Authorization: "Bearer " + session_user.token,
                        },
                    });
        if(result){
            handleNotification('dashboard details loaded successfully', window, 'success','ok');
            dashboard.wallet = result.data[0].wallet;
            dashboard.totalOrders = result.data[1];
        }
      } catch (error) {
        handleNotification('recent data didnt load successfully', window, 'error','error');
      }

        
    });
</script>
<svelte:head>
    <title>ARC :: logistics dashboard</title>
</svelte:head>
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
                    <div class="col-3 text-center">
<i class="icon fa fa-dollar"></i>
                    </div>
                    <div class="col-9">
                        <p class="main-txt mb-0"><strong>₦{dashboard.wallet}</strong></p>
                        <p class="mb-0"><small>wallet balance</small></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
            <div class="card card-body bg-secondary text-white mb-1 mr-1 mt-0 mb-0">
                <div class="row">
                    <div class="col-3 text-center">
                        <i class="icon fa fa-motorcycle"></i>
                    </div>
                    <div class="col-9">
                        <p class="main-txt mb-0"><strong>{dashboard.totalOrders}</strong></p>
                        <p class="mb-0"><small>Total Orders</small></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-sm-6 col-md-3">
            <div class="card card-body bg-danger text-white mb-1 mr-1 mt-0 mb-0">
                <div class="row">
                    <div class="col-3 text-center">
                        <i class="icon fa fa-times"></i>
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
                    <div class="col-3 text-center">
                        <i class="fa fa-exchange icon"></i>
                    </div>
                    <div class="col-9">
                        <p class="main-txt mb-0"><strong>0</strong></p>
                        <p class="mb-0"><small>Pending Transcatons</small></p>
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
    .icon{
       font-size: 30px;
       
    }
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
