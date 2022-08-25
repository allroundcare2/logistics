<script>
    import Nav from "../../components/Nav.svelte";
    const page = "Earning";
    const transcations = [{}, {}];
</script>

<main>
    <div class="container">
        <Nav {page} />

        <p class="order-description mt-3">
            Welcome to your payment account. View and withdraw your earnings
        </p>

        <div class="card card-body green mt-2 mb-3">
            <p class="order-name text-center">Kaana Wallet Balance</p>
            <p class="amount text-center">₦3,000</p>

            <p class="text-center"><button class="btn">withdraw</button></p>
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
                    <p class="title"><strong>Wallet withdraw</strong></p>
                    <p class="small">Nov 28, 2022</p>
                </div>
                <div class="col-3 currency"><p >₦30</p></div>
            </div>
        {:else}
            <!-- empty list -->
        {/each}
    </div>
</main>

<style>
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
