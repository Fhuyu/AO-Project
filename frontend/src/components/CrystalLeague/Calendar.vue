<template>
    <div class="form_global_search uk-text-center uk-width-3 m-4">
        <DatePicker is-dark color="orange" v-model="currentDate" class="calendar-crystal"> <!--  mode="multiple"  -->
        </DatePicker>
    </div>
</template>

<script>

import Calendar from 'v-calendar/lib/components/calendar.umd';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

export default {
    name: 'DateSearch',
    props: ['date'],
    data: function () {
        return {
            currentDate : null,
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
        currentDate : function () {
            this.$emit('dateSearch', this.currentDate)
        },
        date: function() {
            this.currentDate = this.date
        }
    }
}
</script>

<style>
.calendar-crystal > input{
    float:left;
    padding-left: 30px;
    background: #2e2a42;
    color: white;
    border: none;
    height: 32px;
    max-width:260px;
    border-radius: 50px;
}
</style>
