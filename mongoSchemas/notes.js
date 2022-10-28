const mongoose = require("mongoose");
const notesSchema = {
    name: String,
    class_num: String,
    total_days: Number,
    week_days: Number,
    allDates: Array,
    weekDates: Array,
    nweekDate: Array,
    ndates: Array
}
const note = mongoose.model("RS", notesSchema);

module.exports = {
    note
}