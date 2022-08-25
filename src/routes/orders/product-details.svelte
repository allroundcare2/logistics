<script>
    import Nav from "../../components/Nav.svelte";
    import {goto} from '@sapper/app';
    const page = "Product Details";
    const cancel = () =>{
        goto('orders/cancel-order');
    }
</script>

<main>
    <div class="container">
        <Nav {page} />

        <div class="row mb-2">
            <div class="col-12">
                <p>
                    You can pick only 5 multiple orders at a time. Choose the
                    ones that are closer in location
                </p>
            </div>
            <div class="col-12">
                <button
                on:click="{cancel}"
                    style="color: red; background-color:#E5E5E5"
                    class="btn btn-secondary my-secondary float-end"
                    >cancel</button
                >
            </div>
        </div>

        <div class="row mt-0 ">
            <div class="col-12">
                <div class="card card-body">
                    <div>
                        <small>Order ID: No1209906032</small>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <img
                                style="width: 100%;"
                                src="images/indomie.jpg"
                                alt=""
                            />
                        </div>
                        <div class="col-8">
                            <div class="mb-0">
                                <p><strong>Indomie</strong></p>
                            </div>
                            <div class="row mt-n3">
                                <div class="col-5">
                                    <small>Quantity: 2</small>
                                </div>
                                <div class="col-7">
                                    <small class="float-end"
                                        >On 12-08-2022</small
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-0">
            <div class="col-12">
                <div class="card card-body">
                    <div>
                        <small>Order ID: No1209906032</small>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <img
                                style="width: 100%;"
                                src="images/indomie.jpg"
                                alt=""
                            />
                        </div>
                        <div class="col-8">
                            <div class="mb-0">
                                <p><strong>Indomie</strong></p>
                            </div>
                            <div class="row mt-n3">
                                <div class="col-5">
                                    <small>Quantity: 2</small>
                                </div>
                                <div class="col-7">
                                    <small class="float-end"
                                        >On 12-08-2022</small
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-0">
            <div class="col-12">
                <div class="card card-body">
                    <div>
                        <small>Order ID: No1209906032</small>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <img
                                style="width: 100%;"
                                src="images/indomie.jpg"
                                alt=""
                            />
                        </div>
                        <div class="col-8">
                            <div class="mb-0">
                                <p><strong>Indomie</strong></p>
                            </div>
                            <div class="row mt-n3">
                                <div class="col-5">
                                    <small>Quantity: 2</small>
                                </div>
                                <div class="col-7">
                                    <small class="float-end"
                                        >On 12-08-2022</small
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card card-body">
                    <div class="row pt-0">
                        <div class="col-6 pt-0 mt-0">
                            <span class="order-name">Order 311 </span>
                            <span class="distance p-1 ml-2">2.5km</span>
                        </div>
                        <div class="col-6">
                            <small class="float-end order-number"
                                >Order ID: No1209906032</small
                            >
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-9">
                            <div class="row">
                                <div class="col-2">
                                    <span class="order-status mt-2" />
                                </div>
                                <div class="col-10">
                                    <span class="order-description pl-n3"
                                        >3rd Ave road, Ikot Ansa</span
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-3">
                            <span class="done fa fa-check p-1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col ">
                <button class="btn btn-secondary my-btn my-secondary"
                    >message</button
                >
            </div>
            <div class="col">
                <button class="btn my-btn btn-success">call</button>
            </div>
        </div>

        <div class="row mb-4">
            <div class="col-12">
                <button class="btn btn-success my-btn">confirm</button>
            </div>
        </div>
    </div>
</main>

<style>
    main {
        height: 100vh;
        font-family: "Mulish", sans-serif;
    }
    p {
        color: #555b6a;
        font-size: 13px;
        line-height: 15px;
    }

    small {
        font-weight: 400;
        size: 11px;
        line-height: 25px;
        letter-spacing: 1%;
        color: #2f2f2f;
    }
    strong {
        font-weight: 500;
        font-size: 15px;
        line-height: 25px;
        letter-spacing: 0.01em;
        color: #2f2f2f;
    }
</style>
