<script lang="ts">
    import { onMount } from "svelte";
    import Nav from "../../components/Nav.svelte";
    import { checkForSession, getUrl } from "../../functions/clientAuth";
    import { Etranscation, Itranscation, Iuser } from "../../Model/accounts";
    import { goto } from "@sapper/app";
    import axios from "axios";
    import { handleNotification } from "../../functions/clientNot";
    import Loader from "../../components/Loader.svelte";
    const page = "Earning";
    let transcations = [];
    let loading = true;
    let wallet = 0;
    let url = "";
    let session_user: Iuser = {};
    onMount(async () => {
        url = getUrl();
        session_user = checkForSession(goto);
        try {
            const promises = [];
            promises.push(
                axios.get(url + "/drivers/transcations", {
                    headers: {
                        Authorization: "Bearer " + session_user.token,
                    },
                })
            );
            promises.push(
                axios.get(url + "/drivers/driver_information", {
                    headers: {
                        Authorization: "Bearer " + session_user.token,
                    },
                })
            );
            const result = await Promise.all(promises);
            if (result) {
                loading = false;
                handleNotification(
                    "transcation loaded successfully",
                    window,
                    "success",
                    "ok"
                );
                console.log(" the result:", result);
                transcations = result[0].data as any[];
                wallet = result[1].data.wallet;
                console.log("transcation", result[1].data);
            }
        } catch (error) {
            loading = false;
            handleNotification(
                "recent data didnt load successfully",
                window,
                "error",
                "error"
            );
        }
    });

    const withdrawl =async () =>{
     
        let resp : any= prompt('how much do you want to withdraw');
            resp = Number(resp);
      if(!isNaN(resp)){
        let transcation: Itranscation = {amount: resp,description: 'withdrawal request from driver',type: Etranscation.WITHDRAWAL};
       if(resp <= wallet){
       try {
        let data = await axios.post(`${url}/drivers/transcations`, transcation, {
                    headers: {
                        Authorization: "Bearer " + session_user.token,
                    },
                });

            if(data.data){
                console.log(data.data);
                transcations.push(data.data);
                transcations = transcations;
                handleNotification('transcation added successfully', window, 'success', 'ok');
            }
       } catch (error) {
        console.log(error);
        handleNotification('something went wrong we are on it', window, 'error', 'try again');
       }
       }
       else{
        handleNotification('you do not have enough money in your account', window, 'error', 'try again');
       }
      }
      else{
        handleNotification('you must enter digit values only', window, 'error','try again');
      }
    }
</script>

<main>
    {#if !loading}
        <div class="container">
            <Nav {page} />

            <p class="order-description mt-3">
                Welcome to your payment account. View and withdraw your earnings
            </p>

            <div class="card card-body green mt-2 mb-3">
                <p class="order-name text-center">Kaana Wallet Balance</p>
                <p class="amount text-center">₦{wallet}</p>

                <p class="text-center">
                    <button on:click={withdrawl} class="btn">withdraw</button>
                </p>
            </div>

            <p class="heading">recent transcations</p>

            {#each transcations as transcation}
                <div
                    class="row mr-1 ml-1 orange-text"
                    style="border-bottom:  1px solid #D7D7D7;"
                >
                    <div class="col-2">
                        <img class="icon orange" src="svg/vector.svg" alt="" />
                    </div>
                    <div class="col-7">
                        <p class="title">
                            <strong>{transcation.description}</strong>
                        </p>
                        <p class="small">{transcation.createdAt}</p>
                    </div>
                    <div class="col-3 currency">
                        <p>₦{transcation.amount}</p>
                    </div>
                </div>
            {:else}
                <div>
                    <div class="text-center mb-5 pt-5">
                        <img
                            class="icon2 opacity-2 mt-4"
                            src="svg/vector.svg"
                            alt=""
                        />

                        <p class="mt-5">No transcation to display</p>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <Loader />
    {/if}
</main>

<style>
    .opacity-2 {
        opacity: 0.5;
    }
    .small {
        font-size: 12px;
    }
    .title {
        font-weight: 400;
        font-size: 14px;
        line-height: 17.57px;
        color: rgba(3, 9, 25, 1);
    }
    main {
        min-height: 100vh;
        font-family: "Mulish", sans-serif;
        background-color: whitesmoke;
    }
    .green {
        background-color: #27ad60;
        color: white;
    }
    .orange {
        background: rgba(255, 102, 0, 0.1);
        border-radius: 50%;
        border: 1px solid orange;
    }
    .orange-text {
        color: rgba(255, 102, 0, 1);
    }
    .icon {
        width: 25px;
        height: 25px;
    }
    .icon2 {
        width: 40px;
        height: 40px;
    }
    .amount {
        font-weight: 700;
        font-size: 18px;
        line-height: 22.59px;
    }
    .currency {
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        line-height: 15px;
    }
    button {
        width: 141px;
        height: 33px;
        color: white;
        background: rgba(253, 253, 253, 0.27);
        border-radius: 5px;
    }
    .heading {
        font-weight: 700;
        font-size: 16px;
        line-height: 20.08px;
    }
</style>
