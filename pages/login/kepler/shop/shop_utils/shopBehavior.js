var setLogPv = require("./setLogPv.js");

module.exports = Behavior({
    behaviors: [],
    methods: {
        setLogPv(log) {
            setLogPv.setLogPv(log)
        },
        setPin(log) {
            setLogPv.setPin(log)
        },
    }
})
