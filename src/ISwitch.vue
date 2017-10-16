<template>
    <div class="iswitch-container">
        <label class="isw-control">
            <input type="checkbox" class="isw-checkbox">
            <div class="isw-inner">
            </div>
        </label>
        <slot name="outer"></slot>
    </div>
</template>

<style lang="scss">
.iswitch-container {
    display: inline-block;

    .isw-checkbox {
        display: none;
    }
}
</style>

<script>
export default {
    name: 'ISwitch',
    props: [
        {
            name: 'name',
            type: String
        },
        'value',
        {
            name: 'size'
        }
    ],
    data() {
    }
}
</script>