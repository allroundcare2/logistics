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
    import { onMount } from "svelte";
    import {goto} from "@sapper/app";
    import Loader from "../../../components/Loader.svelte";
    import { checkForSession, getUrl } from "../../../functions/clientAuth";
    import type { Iorder, Iuser } from "../../../Model/accounts";
    import axios from "axios";
    import { handleNotification } from "../../../functions/clientNot";
    import Swal from "sweetalert2";

    export let id;
    let loading = true;
    let url = '';
    let user: Iuser = {};
    let order: Iorder = {};
    let weight = 0;

    const gotoOrders =()=>{
        goto('/orders')
    }
    const handlePay =()=>{
        console.log('my order',order.current_status);
        if(order.current_status == 'completed'){

            goto('orders/delivery-reciept/payment?id=' + order._id
            );
        }
        else{
            goto('/orders');
        }
       // handleNotification('')
      
    }
    onMount(async ()=>{
        url = getUrl();
        user = checkForSession(goto);

        try {
            const orderResp = await axios.get(
                `${url}/order/get_single_order?id=${id}`,
                {
                    headers: {
                        Authorization: "Bearer " + user.token,
                    },
                }
            );
            if (orderResp) {
                handleNotification(
                    "order has been retrieved",
                    window,
                    "success",
                    "ok"
                );
                loading = false;

                order = orderResp.data;
                order.products.forEach((product)=>{
                    product.prices.forEach((price)=>{
                        weight += price.size || 0;
                    })
                })

            }
 
        } catch (error) {
         let resp = await Swal.fire('loading failed',
            `<p>oops! we cannot load this order at the moment </p>
            <p><strong>Please Try again later!</strong> </p>`, 'error');
            if(resp) goto('orders');
        }
          })
</script>

<main>
  {#if !loading}
  <div class="container mb-2">
    <h2 class="strong mt-5 text-center">Welldone!</h2>
    <p class="comment mt-3 mb-3">
        Thanks for the delivery. You,ve earned some cash for this delivery.
        Summary of delivery is detailed below. Would you like to continue?
    </p>
    <div class="cost-table p-3 mt-5 mb-3">
        <p class="heading"><span>Total</span> <span class="float-right">₦300</span></p>
        <p class="table-row mt-4"><span>Order Weight</span> <span class="float-right">{weight}kg</span></p>
        <hr>
        <p class="table-row mt-2"><span>Amount Earned</span> <span class="float-right">₦300</span></p>
        <hr>
        <p class="table-row mt-2"><span>Payment Status</span> <span class="float-right">
            {order.current_status == 'completed' 
        || order.current_status == 'reciept submitted' ? order.status[order.status.length -1].reason 
        || order.current_status : 'paid' }</span></p>
    </div>

    <div class="lower-buttons mt-5 row">
       <div class="col text-center d-grid gap-2">
        <button on:click="{gotoOrders}" class="btn btn-primary">dashboard</button>
       </div>
      <div class="col text-center d-grid gap-2">
        <button on:click="{handlePay}" class="btn btn-secondary btn-block">continue</button>
      </div>
    </div>
</div>
  {:else}
  <Loader/>
  {/if}
</main>

<style>
    hr{
        background-color: white;
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
    .cost-table{
        background: #133040;
border-radius: 5px;
    }
    .heading {
        font-family: 'Mulish';
font-style: normal;
font-weight: 700;
font-size: 16px;
line-height: 15px;

color: #F7F7F7;
    }
    .table-row{
        font-family: 'Mulish';
font-style: normal;
font-weight: 400;
font-size: 12px;
line-height: 15px;
color: #FFFFFF;
    }
</style>
