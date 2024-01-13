
<script lang="ts">
    export let products: any = [];
</script>

<!-- Modal -->
<div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="productModalLabel">Product List</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="list-group">
               {#each products as product}
               <!-- svelte-ignore a11y-label-has-associated-control -->
               <!-- svelte-ignore a11y-invalid-attribute -->
               <a href="javascript:void(0);" class="list-group-item list-group-item-action" aria-current="true">
                <div class="d-flex w-100 justify-content-between">
                 <div class="row">
                    <div class="col-10">
                        <p class="mb-1">{product.name}</p>
                        <small>{product.category}</small>
                    </div>
                    <dic class="col-2">
                        <img src="{product.images[0]}" alt="">
                    </dic>
                 </div>
                  
                </div>
             
              </a>
            
               {/each}

            </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>