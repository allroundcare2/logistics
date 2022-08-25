<script>
    export let step;
</script>

<nav class="row">
<div class="col-3"><i class="fa  fa-arrow-left"></i></div>
<div class="col-6">   <h2 class="text-center">ARC</h2> </div>
<div class="col-3">{#if step != '0'}
     <!-- content here -->
     <small class="float-end">step <span>{step}</span> of 4</small>
{/if}</div>
</nav>


<style>
    span {
        color:#27ad60
    }
    i {
        color:#555B6A;
        font-size: 25px;
    }
    h2 {
        color: #27ad60;
        font-family: "Mulish", sans-serif;
        font-weight: 800;
    }
   
</style>