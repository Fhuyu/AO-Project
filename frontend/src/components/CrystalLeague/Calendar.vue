<template>
    <div class="form_global_search uk-text-center uk-width-3 m-4">
        <DatePicker is-dark color="orange" v-model="dates" class="calendar-crystal"> <!--  mode="multiple"  -->
        </DatePicker>
    </div>
</template>

<script>

import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

export default {
    name: 'DateSearch',
    props: [],
    data: function () {
        return {
            dates : []
        }
    },
    components: {
        Calendar,
        DatePicker,
    },
    methods: {
    },
    computed: {
        
    },
    mounted () {

    },
    watch: {
        dates : function () {
            this.$emit('dateSearch', this.dates)
        }
    }
}
</script>

<style>
.calendar-crystal > input{
    background: #2e2a42;
    color: white;
    border: none;
    height: 32px;
    border-radius: 50px;
}
</style>
